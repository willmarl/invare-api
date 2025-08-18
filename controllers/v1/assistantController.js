const Inventory = require("../../models/inventory");
const Module = require("../../models/module");

exports.handleChat = async (req, res, next) => {
  try {
    const user = req.user._id;

    const userInventoryList = await Inventory.find({ userId: user });
    const ownedModules = await Promise.all(
      userInventoryList.map(async (individualInv) => {
        const module = await Module.findById(individualInv.moduleId);
        return {
          module: module.name,
          quantity: individualInv.quantity,
          description: module.description,
        };
        // maybe send descripition and image too if output is poor
      }),
    );

    const prompt = `You are an assistant that is a concise hardware inventory assistant for Arduino/Raspberry/ESP makers. Only use the user's inventory below. If the answer depends on items not listed, say what is missing. Try to keep responses short and simple. If appropriate, offer a better way to user's code, problem, solution, etc. Current inventory is ${JSON.stringify(ownedModules)}`;

    // Accepts req.body.messages (array of {role, content})
    const userMessages = Array.isArray(req.body.messages)
      ? req.body.messages
      : [];
    // Prepend system prompt
    const openaiMessages = [
      { role: "system", content: prompt },
      ...userMessages.filter(
        (m) => m.role === "user" || m.role === "assistant",
      ),
    ];

    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: openaiMessages,
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
    return next(err);
  }
};
