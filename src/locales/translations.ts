export type Locale = 'en' | 'nl'

export interface Translations {
  // Common
  common: {
    cancel: string
    save: string
    delete: string
    edit: string
    add: string
    close: string
    confirm: string
    back: string
    next: string
    search: string
    loading: string
    error: string
    success: string
    yes: string
    no: string
    optional: string
    required: string
    total: string
  }
  
  // Navigation
  nav: {
    home: string
    players: string
    groups: string
    settings: string
  }
  
  // Authentication
  auth: {
    signIn: string
    signUp: string
    signOut: string
    email: string
    password: string
    forgotPassword: string
    resetPassword: string
    alreadyHaveAccount: string
    dontHaveAccount: string
    sendResetLink: string
    checkEmail: string
    resetLinkSent: string
    confirmationLinkSent: string
    signInToDashboard: string
    continueWithEmail: string
    pleaseWait: string
  }
  
  // Home Page
  home: {
    title: string
    subtitle: string
    welcome: string
    quickMatch: string
    recentGroups: string
    activePlayers: string
    noActivePlayers: string
    selectPlayersFirst: string
    generateMatches: string
    noGroups: string
    createFirstGroup: string
  }
  
  // Players
  players: {
    title: string
    addPlayer: string
    newPlayer: string
    editPlayer: string
    deletePlayer: string
    playerName: string
    noPlayers: string
    createFirstPlayer: string
    playerAdded: string
    playerUpdated: string
    playerDeleted: string
    confirmDelete: string
    deleteMessage: string
    searchPlayers: string
    totalPlayers: string
    active: string
    inactive: string
  }
  
  // Groups
  groups: {
    title: string
    addGroup: string
    editGroup: string
    deleteGroup: string
    groupName: string
    groupColor: string
    matchType: string
    noGroups: string
    createFirstGroup: string
    groupAdded: string
    groupUpdated: string
    groupDeleted: string
    confirmDelete: string
    deleteMessage: string
    searchGroups: string
    totalGroups: string
    viewDetails: string
    random: string
    scheduled: string
    selectPlayers: string
    selectedPlayers: string
  }
  
  // Group Detail
  groupDetail: {
    groupDetails: string
    editGroup: string
    deleteGroup: string
    addSubPage: string
    editSubPage: string
    deleteSubPage: string
    subPageName: string
    date: string
    selectDate: string
    noSubPages: string
    createFirstSubPage: string
    selectPlayers: string
    playersAttending: string
    generateMatches: string
    noPlayersSelected: string
    matches: string
    subPageAdded: string
    subPageUpdated: string
    subPageDeleted: string
  }
  
  // Matches
  matches: {
    title: string
    vs: string
    team: string
    match: string
    regenerate: string
    noMatches: string
    generatedSuccessfully: string
  }
  
  // Settings
  settings: {
    title: string
    general: string
    language: string
    selectLanguage: string
    theme: string
    selectTheme: string
    light: string
    dark: string
    system: string
    account: string
    profile: string
    signedInAs: string
    signOut: string
    data: string
    exportData: string
    importData: string
    clearAllData: string
    confirmClearData: string
    clearDataMessage: string
    dataExported: string
    dataImported: string
    dataCleared: string
    about: string
    version: string
    documentation: string
  }
  
  // Errors
  errors: {
    somethingWentWrong: string
    tryAgain: string
    invalidEmail: string
    passwordTooShort: string
    passwordsDontMatch: string
    requiredField: string
    signInFailed: string
    signUpFailed: string
    signOutFailed: string
    loadFailed: string
    saveFailed: string
    deleteFailed: string
    networkError: string
    unauthorized: string
    notFound: string
    databaseError: string
    databaseErrorSavingUser: string
  }
  
  // Success Messages
  success: {
    saved: string
    updated: string
    deleted: string
    created: string
    signedIn: string
    signedOut: string
    copied: string
  }
}

export const translations: Record<Locale, Translations> = {
  en: {
    common: {
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      close: 'Close',
      confirm: 'Confirm',
      back: 'Back',
      next: 'Next',
      search: 'Search',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      yes: 'Yes',
      no: 'No',
      optional: 'Optional',
      required: 'Required',
      total: 'total',
    },
    nav: {
      home: 'Home',
      players: 'Players',
      groups: 'Groups',
      settings: 'Settings',
    },
    auth: {
      signIn: 'Sign In',
      signUp: 'Sign Up',
      signOut: 'Sign Out',
      email: 'Email',
      password: 'Password',
      forgotPassword: 'Forgot password?',
      resetPassword: 'Reset Password',
      alreadyHaveAccount: 'Already have an account? Sign in',
      dontHaveAccount: "Don't have an account? Sign up",
      sendResetLink: 'Send Reset Link',
      checkEmail: 'Check your email',
      resetLinkSent: 'Password reset link sent! Check your email.',
      confirmationLinkSent: 'Check your email for the confirmation link!',
      signInToDashboard: 'Sign in to your personal dashboard',
      continueWithEmail: 'Or continue with email',
      pleaseWait: 'Please wait...',
    },
    home: {
      title: 'MatchMaker',
      subtitle: 'Create perfect matches for your players',
      welcome: 'Welcome back',
      quickMatch: 'Quick Match',
      recentGroups: 'Recent Groups',
      activePlayers: 'Active Players',
      noActivePlayers: 'No active players',
      selectPlayersFirst: 'Select players first to generate matches',
      generateMatches: 'Generate Matches',
      noGroups: 'No groups yet',
      createFirstGroup: 'Create your first group to get started',
    },
    players: {
      title: 'Players',
      addPlayer: 'Add',
      newPlayer: 'New',
      editPlayer: 'Edit Player',
      deletePlayer: 'Delete Player',
      playerName: 'Player Name',
      noPlayers: 'No players yet',
      createFirstPlayer: 'Add your first player to get started',
      playerAdded: 'Player added successfully',
      playerUpdated: 'Player updated successfully',
      playerDeleted: 'Player deleted successfully',
      confirmDelete: 'Delete Player?',
      deleteMessage: 'Are you sure you want to delete this player? This action cannot be undone.',
      searchPlayers: 'Search players...',
      totalPlayers: 'Total Players',
      active: 'Active',
      inactive: 'Inactive',
    },
    groups: {
      title: 'Groups',
      addGroup: 'Add Group',
      editGroup: 'Edit Group',
      deleteGroup: 'Delete Group',
      groupName: 'Group Name',
      groupColor: 'Group Color',
      matchType: 'Match Type',
      noGroups: 'No groups yet',
      createFirstGroup: 'Create your first group to get started',
      groupAdded: 'Group added successfully',
      groupUpdated: 'Group updated successfully',
      groupDeleted: 'Group deleted successfully',
      confirmDelete: 'Delete Group?',
      deleteMessage: 'Are you sure you want to delete this group? This action cannot be undone.',
      searchGroups: 'Search groups...',
      totalGroups: 'Total Groups',
      viewDetails: 'View Details',
      random: 'Random',
      scheduled: 'Scheduled',
      selectPlayers: 'Select Players',
      selectedPlayers: 'Selected Players',
    },
    groupDetail: {
      groupDetails: 'Group Details',
      editGroup: 'Edit Group',
      deleteGroup: 'Delete Group',
      addSubPage: 'Add Session',
      editSubPage: 'Edit Session',
      deleteSubPage: 'Delete Session',
      subPageName: 'Session Name',
      date: 'Date',
      selectDate: 'Select Date',
      noSubPages: 'No sessions yet',
      createFirstSubPage: 'Create your first session to get started',
      selectPlayers: 'Select Players',
      playersAttending: 'Players Attending',
      generateMatches: 'Generate Matches',
      noPlayersSelected: 'No players selected for this session',
      matches: 'Matches',
      subPageAdded: 'Session added successfully',
      subPageUpdated: 'Session updated successfully',
      subPageDeleted: 'Session deleted successfully',
    },
    matches: {
      title: 'Matches',
      vs: 'vs',
      team: 'Team',
      match: 'Match',
      regenerate: 'Regenerate',
      noMatches: 'No matches generated yet',
      generatedSuccessfully: 'Matches generated successfully',
    },
    settings: {
      title: 'Settings',
      general: 'General',
      language: 'Language',
      selectLanguage: 'Select Language',
      theme: 'Theme',
      selectTheme: 'Select Theme',
      light: 'Light',
      dark: 'Dark',
      system: 'System',
      account: 'Account',
      profile: 'Profile',
      signedInAs: 'Signed in as',
      signOut: 'Sign Out',
      data: 'Data',
      exportData: 'Export Data',
      importData: 'Import Data',
      clearAllData: 'Clear All Data',
      confirmClearData: 'Clear All Data?',
      clearDataMessage: 'Are you sure you want to clear all data? This action cannot be undone.',
      dataExported: 'Data exported successfully',
      dataImported: 'Data imported successfully',
      dataCleared: 'All data cleared successfully',
      about: 'About',
      version: 'Version',
      documentation: 'Documentation',
    },
    errors: {
      somethingWentWrong: 'Something went wrong',
      tryAgain: 'Please try again',
      invalidEmail: 'Invalid email address',
      passwordTooShort: 'Password must be at least 6 characters',
      passwordsDontMatch: 'Passwords do not match',
      requiredField: 'This field is required',
      signInFailed: 'Failed to sign in',
      signUpFailed: 'Failed to sign up',
      signOutFailed: 'Failed to sign out',
      loadFailed: 'Failed to load data',
      saveFailed: 'Failed to save',
      deleteFailed: 'Failed to delete',
      networkError: 'Network error. Please check your connection.',
      unauthorized: 'Unauthorized. Please sign in.',
      notFound: 'Not found',
      databaseError: 'Database error',
      databaseErrorSavingUser: 'Database error saving new user',
    },
    success: {
      saved: 'Saved successfully',
      updated: 'Updated successfully',
      deleted: 'Deleted successfully',
      created: 'Created successfully',
      signedIn: 'Signed in successfully',
      signedOut: 'Signed out successfully',
      copied: 'Copied to clipboard',
    },
  },
  nl: {
    common: {
      cancel: 'Annuleren',
      save: 'Opslaan',
      delete: 'Verwijderen',
      edit: 'Bewerken',
      add: 'Toevoegen',
      close: 'Sluiten',
      confirm: 'Bevestigen',
      back: 'Terug',
      next: 'Volgende',
      search: 'Zoeken',
      loading: 'Laden...',
      error: 'Fout',
      success: 'Gelukt',
      yes: 'Ja',
      no: 'Nee',
      optional: 'Optioneel',
      required: 'Verplicht',
      total: 'totaal',
    },
    nav: {
      home: 'Home',
      players: 'Spelers',
      groups: 'Groepen',
      settings: 'Instellingen',
    },
    auth: {
      signIn: 'Inloggen',
      signUp: 'Registreren',
      signOut: 'Uitloggen',
      email: 'E-mail',
      password: 'Wachtwoord',
      forgotPassword: 'Wachtwoord vergeten?',
      resetPassword: 'Wachtwoord Resetten',
      alreadyHaveAccount: 'Heb je al een account? Log in',
      dontHaveAccount: 'Heb je nog geen account? Registreer',
      sendResetLink: 'Verstuur Reset Link',
      checkEmail: 'Controleer je e-mail',
      resetLinkSent: 'Wachtwoord reset link verstuurd! Controleer je e-mail.',
      confirmationLinkSent: 'Controleer je e-mail voor de bevestigingslink!',
      signInToDashboard: 'Log in op je persoonlijke dashboard',
      continueWithEmail: 'Of ga verder met e-mail',
      pleaseWait: 'Een moment geduld...',
    },
    home: {
      title: 'MatchMaker',
      subtitle: 'Creëer perfecte wedstrijden voor je spelers',
      welcome: 'Welkom terug',
      quickMatch: 'Snelle Wedstrijd',
      recentGroups: 'Recente Groepen',
      activePlayers: 'Actieve Spelers',
      noActivePlayers: 'Geen actieve spelers',
      selectPlayersFirst: 'Selecteer eerst spelers om wedstrijden te genereren',
      generateMatches: 'Genereer Wedstrijden',
      noGroups: 'Nog geen groepen',
      createFirstGroup: 'Maak je eerste groep om te beginnen',
    },
    players: {
      title: 'Spelers',
      addPlayer: 'Toevoegen',
      newPlayer: 'Nieuw',
      editPlayer: 'Speler Bewerken',
      deletePlayer: 'Speler Verwijderen',
      playerName: 'Speler Naam',
      noPlayers: 'Nog geen spelers',
      createFirstPlayer: 'Voeg je eerste speler toe om te beginnen',
      playerAdded: 'Speler succesvol toegevoegd',
      playerUpdated: 'Speler succesvol bijgewerkt',
      playerDeleted: 'Speler succesvol verwijderd',
      confirmDelete: 'Speler Verwijderen?',
      deleteMessage: 'Weet je zeker dat je deze speler wilt verwijderen? Dit kan niet ongedaan worden gemaakt.',
      searchPlayers: 'Zoek spelers...',
      totalPlayers: 'Totaal Spelers',
      active: 'Actief',
      inactive: 'Inactief',
    },
    groups: {
      title: 'Groepen',
      addGroup: 'Groep Toevoegen',
      editGroup: 'Groep Bewerken',
      deleteGroup: 'Groep Verwijderen',
      groupName: 'Groep Naam',
      groupColor: 'Groep Kleur',
      matchType: 'Wedstrijd Type',
      noGroups: 'Nog geen groepen',
      createFirstGroup: 'Maak je eerste groep om te beginnen',
      groupAdded: 'Groep succesvol toegevoegd',
      groupUpdated: 'Groep succesvol bijgewerkt',
      groupDeleted: 'Groep succesvol verwijderd',
      confirmDelete: 'Groep Verwijderen?',
      deleteMessage: 'Weet je zeker dat je deze groep wilt verwijderen? Dit kan niet ongedaan worden gemaakt.',
      searchGroups: 'Zoek groepen...',
      totalGroups: 'Totaal Groepen',
      viewDetails: 'Bekijk Details',
      random: 'Willekeurig',
      scheduled: 'Gepland',
      selectPlayers: 'Selecteer Spelers',
      selectedPlayers: 'Geselecteerde Spelers',
    },
    groupDetail: {
      groupDetails: 'Groep Details',
      editGroup: 'Groep Bewerken',
      deleteGroup: 'Groep Verwijderen',
      addSubPage: 'Sessie Toevoegen',
      editSubPage: 'Sessie Bewerken',
      deleteSubPage: 'Sessie Verwijderen',
      subPageName: 'Sessie Naam',
      date: 'Datum',
      selectDate: 'Selecteer Datum',
      noSubPages: 'Nog geen sessies',
      createFirstSubPage: 'Maak je eerste sessie om te beginnen',
      selectPlayers: 'Selecteer Spelers',
      playersAttending: 'Deelnemende Spelers',
      generateMatches: 'Genereer Wedstrijden',
      noPlayersSelected: 'Geen spelers geselecteerd voor deze sessie',
      matches: 'Wedstrijden',
      subPageAdded: 'Sessie succesvol toegevoegd',
      subPageUpdated: 'Sessie succesvol bijgewerkt',
      subPageDeleted: 'Sessie succesvol verwijderd',
    },
    matches: {
      title: 'Wedstrijden',
      vs: 'vs',
      team: 'Team',
      match: 'Wedstrijd',
      regenerate: 'Opnieuw Genereren',
      noMatches: 'Nog geen wedstrijden gegenereerd',
      generatedSuccessfully: 'Wedstrijden succesvol gegenereerd',
    },
    settings: {
      title: 'Instellingen',
      general: 'Algemeen',
      language: 'Taal',
      selectLanguage: 'Selecteer Taal',
      theme: 'Thema',
      selectTheme: 'Selecteer Thema',
      light: 'Licht',
      dark: 'Donker',
      system: 'Systeem',
      account: 'Account',
      profile: 'Profiel',
      signedInAs: 'Ingelogd als',
      signOut: 'Uitloggen',
      data: 'Data',
      exportData: 'Data Exporteren',
      importData: 'Data Importeren',
      clearAllData: 'Alle Data Wissen',
      confirmClearData: 'Alle Data Wissen?',
      clearDataMessage: 'Weet je zeker dat je alle data wilt wissen? Dit kan niet ongedaan worden gemaakt.',
      dataExported: 'Data succesvol geëxporteerd',
      dataImported: 'Data succesvol geïmporteerd',
      dataCleared: 'Alle data succesvol gewist',
      about: 'Over',
      version: 'Versie',
      documentation: 'Documentatie',
    },
    errors: {
      somethingWentWrong: 'Er is iets misgegaan',
      tryAgain: 'Probeer het opnieuw',
      invalidEmail: 'Ongeldig e-mailadres',
      passwordTooShort: 'Wachtwoord moet minimaal 6 tekens zijn',
      passwordsDontMatch: 'Wachtwoorden komen niet overeen',
      requiredField: 'Dit veld is verplicht',
      signInFailed: 'Inloggen mislukt',
      signUpFailed: 'Registreren mislukt',
      signOutFailed: 'Uitloggen mislukt',
      loadFailed: 'Laden van data mislukt',
      saveFailed: 'Opslaan mislukt',
      deleteFailed: 'Verwijderen mislukt',
      networkError: 'Netwerkfout. Controleer je verbinding.',
      unauthorized: 'Niet geautoriseerd. Log alsjeblieft in.',
      notFound: 'Niet gevonden',
      databaseError: 'Database fout',
      databaseErrorSavingUser: 'Database fout bij opslaan nieuwe gebruiker',
    },
    success: {
      saved: 'Succesvol opgeslagen',
      updated: 'Succesvol bijgewerkt',
      deleted: 'Succesvol verwijderd',
      created: 'Succesvol aangemaakt',
      signedIn: 'Succesvol ingelogd',
      signedOut: 'Succesvol uitgelogd',
      copied: 'Gekopieerd naar klembord',
    },
  },
}
