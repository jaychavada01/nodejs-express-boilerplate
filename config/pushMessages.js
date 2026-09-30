const { NOTIFICATION_EVENTS, LANGUAGES } = require("./constants");

/*
 * PUSH NOTIFICATION MESSAGE TEMPLATES
 * Multi-language message catalog with dynamic {{placeholder}} variables.
 */
const pushMessages = {
  [NOTIFICATION_EVENTS.USER_WELCOME]: {
    [LANGUAGES.EN]: {
      title: "Welcome to Our Platform!",
      body: "Hi {{name}}, your account is now active. Explore features and get started today!",
    },
    [LANGUAGES.NL]: {
      title: "Welkom op ons platform!",
      body: "Hallo {{name}}, je account is nu actief. Ontdek vandaag nog alle mogelijkheden!",
    },
    [LANGUAGES.ES]: {
      title: "¡Bienvenido a nuestra plataforma!",
      body: "¡Hola {{name}}, tu cuenta ya está activa. ¡Empieza a explorar hoy mismo!",
    },
  },

  [NOTIFICATION_EVENTS.SAMPLE_CREATED]: {
    [LANGUAGES.EN]: {
      title: "New Item Created",
      body: 'Item "{{title}}" has been successfully created by {{author}}.',
    },
    [LANGUAGES.NL]: {
      title: "Nieuw item aangemaakt",
      body: 'Item "{{title}}" is succesvol aangemaakt door {{author}}.',
    },
    [LANGUAGES.ES]: {
      title: "Nuevo elemento creado",
      body: 'El elemento "{{title}}" ha sido creado con éxito por {{author}}.',
    },
  },

  [NOTIFICATION_EVENTS.SAMPLE_UPDATED]: {
    [LANGUAGES.EN]: {
      title: "Item Updated",
      body: 'Item "{{title}}" has been updated with new details.',
    },
    [LANGUAGES.NL]: {
      title: "Item bijgewerkt",
      body: 'Item "{{title}}" is bijgewerkt met nieuwe details.',
    },
    [LANGUAGES.ES]: {
      title: "Elemento actualizado",
      body: 'El elemento "{{title}}" se ha actualizado con nuevos detalles.',
    },
  },

  [NOTIFICATION_EVENTS.SYSTEM_ALERT]: {
    [LANGUAGES.EN]: {
      title: "System Notification",
      body: "{{message}}",
    },
    [LANGUAGES.NL]: {
      title: "Systeemmelding",
      body: "{{message}}",
    },
    [LANGUAGES.ES]: {
      title: "Notificación del sistema",
      body: "{{message}}",
    },
  },
};

module.exports = { pushMessages };
