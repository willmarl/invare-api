const Inventory = require("../../models/inventory");
const Module = require("../../models/module");

exports.handleChat = async (req, res, next) => {
  try {
    const user = req.user._id;

    const userInventoryList = await Inventory.find({ userId: user });
    const ownedModules = await Promise.all(
      userInventoryList.map(async (individualInv) => {
        const module = await Module.findById(individualInv.moduleId);
        return { module: module.name, quantity: individualInv.quantity };
        // maybe send descripition and image too if output is poor
      }),
    );
    const prompt = `You are an assistant that is a concise hardware inventory assistant for Arduino/Raspberry/ESP makers. Only use the user's inventory below. If the answer depends on items not listed, say what is missing. Keep responses short and simple with no markdown. Current inventory is ${JSON.stringify(ownedModules)}`;

    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: [
          { role: "system", content: prompt },
          { role: "user", content: req.body.message },
        ],
      }),
    });

    if (!r.ok) {
      const errBody = await r.text().catch(() => "");
      return res.status(r.status).json(errBody);
    }

    const data = await r.json();
    const filteredData = data?.output[0].content[0].text;

    return res.json({ chatbotReply: filteredData });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
