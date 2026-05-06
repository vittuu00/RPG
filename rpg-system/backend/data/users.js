module.exports = {
  mestre: {
    password: "123",
    role: "mestre"
  },

  detetive: {
    password: "123",
    role: "player",
    character: {
      name: "Detetive",

      attributes: {
        strength: 2,
        agility: 3,
        intellect: 4,
        vigor: 2,
        presence: 2
      },

      stats: {
        hp: 100,
        sanity: 100,
        maxSanity: 100,
        energy: 50
      },

      skills: {
        investigation: 5,
        perception: 4,
        reflexes: 3,
        fighting: 2,
        will: 3
      },

      inventory: [],
      abilities: [],
      description: "Especialista em investigação"
    }
  },

  medico: {
    password: "123",
    role: "player",
    character: {
      name: "Médico",

      attributes: {
        strength: 2,
        agility: 3,
        intellect: 4,
        vigor: 2,
        presence: 2
      },

      stats: {
        hp: 100,
        sanity: 100,
        maxSanity: 100,
        energy: 50
      },

      skills: {
        investigation: 5,
        perception: 4,
        reflexes: 3,
        fighting: 2,
        will: 3
      },

      inventory: [],
      abilities: [],
      description: "Especialista em suporte"
    }
  }
};