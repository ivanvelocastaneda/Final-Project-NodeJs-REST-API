const state = require("../model/states.js");

const data = {
  states: require("../model/states.json"),
  setStates(data) {
    this.states = data;
  }
};

// Retrieves and returns all States information from database

const getAllStates = async (req, res) => {
  let result = [];
  const states = await state.find().exec();
  data.states.forEach((state) => {
    if (
      req.query.config === "true" &&
      state.code == "AK" &&
      state.code == "HI"
    ) {
      return;
    }
    if (
      req.query.config === "false" &&
      !(state.code == "AK" && state.code == "HI")
    ) {
      return;
    }
    const statefacts = states.find((x) => x.stateCode == states.code);
    if (statefacts) output.push({ ...state, funfacts: statefacts.funfacts });
  });
  res.json(result);
};

const getState = async (req, res) => {
  const state = require("../model/states.json").find(
    (s) => s.code === req.params.state
  );

  // returns a 404 error if state does not exist
  if (!state) {
    res.status(404).send(`State ${req.params.state} not found.`);
    return;
  }

  // returns a random fun fact if it is present
  const stateWithFacts = await state.findOne({ code: req.params.state });
  if (stateWithFacts) {
    state.funfact =
      stateWithFacts.funfacts[
        Math.floor(Math.random() * stateWithFacts.funfacts.length)
      ];
  }
  res.json(state);
};

const getCapital = (req, res) => {
  const state = require("../model/states.json").find(
    (s) => s.code === req.params.state
  );
  if (!state) {
    res.status(404).send(`State ${req.params.state} not found`);
    return;
  }

  const capitalObject = { state: state.name, capital: state.capital };
  res.json(capitalObject);
};

const getNickname = (req, res) => {
  const state = require("../model/states.json").find(
    (s) => s.code === req.params.state
  );

  if (!state) {
    res.status(404).send(`State ${req.params.state} not found`);
    return;
  }

  const nicknameObject = { state: state.name, nickname: state.nickname };
  res.json(nicknameObject);
};

const getPopulation = (req, res) => {
  const state = require("../model/states.json").find(
    (s) => s.code === req.params.state
  );

  if (!state) {
    res.status(404).send(`State ${req.params.state} not found`);
    return;
  }

  const populationObject = { state: state.name, population: state.population };
  res.json(populationObject);
};

const getAdmission = (req, res) => {
  const state = require("../model/states.json").find(
    (s) => s.code === req.params.state
  );

  if (!state) {
    res.status(404).send(`State ${req.params.state} not found`);
    return;
  }

  const admissionObject = {
    state: state.name,
    admission_date: state.admission_date,
    admission_number: state.admission_number
  };
  res.json(admissionObject);
};

const getFact = async (req, res) => {
  // Uses the spcified code Model to find a state
  const stateWithFunFacts = await State.findOne({ code: req.params.state });
  // A 404 error is thrown if no state is found or if there are no fun facts for the state
  if (!stateWithFunFacts || stateWithFunFacts.funfacts.length === 0) {
    res.status(404).send(`No fun facts found for state ${req.params.state}`);
    return;
  }
  // Picks a random fun fact for the state from the list of fun facts
  const funFact =
    stateWithFunFacts.funfacts[
      Math.floor(Math.random() * stateWithFunFacts.funfacts.length)
    ];
  res.json(funFact);
};

const addFact = async (req, res) => {
  try {
    const { state } = req.params;
    const { funfacts } = req.body;

    if (!funfacts || !Array.isArray(funfacts)) {
      return res.status(400).json({ message: "Invalid request body" });
    }

    const stateData = await State.findOne({ stateCode: state });

    if (!stateData) {
      const newStateData = new State({ stateCode: state, funfacts });
      await newStateData.save();
      return res.status(201).json(newStateData);
    }

    stateData.funfacts = [...stateData.funfacts, ...funfacts];
    await stateData.save();

    return res.status(200).json(stateData);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateFact = async (req, res) => {
  try {
    const { state } = req.params;
    const { index, funfact } = req.body;

    if (!index || !funfact) {
      return res.status(400).json({ message: "Invalid request body" });
    }

    const stateData = await State.findOne({ stateCode: state });

    if (
      !stateData ||
      stateData.funfacts.length === 0 ||
      stateData.funfacts.length < index
    ) {
      return res.status(404).json({ message: "Fun fact not found" });
    }

    stateData.funfacts[index - 1] = funfact;
    await stateData.save();

    return res.status(200).json(stateData);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteFact = async (req, res) => {
  try {
    const { state } = req.params;
    const { index } = req.body;

    if (!index) {
      return res.status(400).json({ message: "Invalid request body" });
    }

    const stateData = await State.findOne({ stateCode: state });

    if (
      !stateData ||
      stateData.funfacts.length === 0 ||
      stateData.funfacts.length < index
    ) {
      return res.status(404).json({ message: "Fun fact not found" });
    }

    stateData.funfacts = stateData.funfacts.filter((_, i) => i !== index - 1);
    await stateData.save();

    return res.status(200).json(stateData);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllStates,
  getState,
  getFact,
  getCapital,
  getNickname,
  getPopulation,
  getAdmission,
  updateFact,
  addFact,
  deleteFact
};
