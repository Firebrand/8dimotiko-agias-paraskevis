// Hand-curated structural content: the sitemap, the staff directory and the
// school's contact details. Transcribed from the legacy site so the migration
// produces a clean information architecture instead of WordPress leftovers.

export const SCHOOL = {
  title: "8ο Δημοτικό Σχολείο Αγίας Παρασκευής",
  shortTitle: "8ο Δημοτικό Αγίας Παρασκευής",
  description:
    "Επίσημος ιστότοπος του 8ου Δημοτικού Σχολείου Αγίας Παρασκευής. Νέα, ανακοινώσεις, σχολική ζωή, δράσεις και χρήσιμες πληροφορίες για μαθητές, γονείς και κηδεμόνες.",
  address: "Ρήγα Φεραίου 3, Αγία Παρασκευή 153 42",
  phone: "210 6014032",
  email: "mail@8dim-ag-parask.att.sch.gr",
  officeHours: "Δευτέρα – Παρασκευή, 08:00 – 14:00",
  parentsAssociationUrl: "http://syllogos8agp.gr",
  mapQuery: "Ρήγα Φεραίου 3, Αγία Παρασκευή 153 42",
  heroTitle: "Ένα σχολείο που μαθαίνει, δημιουργεί και μεγαλώνει μαζί",
  heroText:
    "Καλώς ήρθατε στον ιστότοπο του 8ου Δημοτικού Σχολείου Αγίας Παρασκευής. Εδώ θα βρείτε τις ανακοινώσεις μας, τη σχολική ζωή και όλες τις πληροφορίες που χρειάζεστε.",
  highlights: [
    { value: "11", label: "τμήματα" },
    { value: "1957", label: "από το" },
    { value: "15:50", label: "λήξη ολοημέρου" },
  ],
};

/**
 * `wp` links a new page to its WordPress source; pages without it are new
 * (section landings and the contact page the old site never really had).
 */
export const PAGES = [
  {
    slug: "to-scholeio-mas",
    title: "Το σχολείο μας",
    wp: 15,
    subtitle:
      "Ποιοι είμαστε, πού βρισκόμαστε και ποιοι είναι οι εκπαιδευτικοί που υποδέχονται καθημερινά τα παιδιά μας.",
    isSection: true,
  },
  { slug: "minyma-tis-diefthynsis", title: "Μήνυμα της Διεύθυνσης", wp: 40 },
  {
    slug: "genikes-plirofories",
    title: "Γενικές Πληροφορίες",
    wp: 43,
    subtitle: "Στοιχεία επικοινωνίας και η θέση του σχολείου.",
    showContactDetails: true,
  },
  {
    slug: "didaktiko-prosopiko",
    title: "Διδακτικό Προσωπικό – Ώρες Επικοινωνίας",
    wp: 136,
    subtitle: "Σχολική χρονιά 2025-2026. Οι ώρες επικοινωνίας ισχύουν κατόπιν συνεννόησης.",
    showStaffDirectory: true,
    // The directory is rendered from the staff documents, so drop the legacy prose.
    dropBody: true,
  },
  {
    slug: "oria-tou-scholeiou",
    title: "Όρια του σχολείου μας",
    wp: 33,
    subtitle: "Η σχολική περιφέρεια του 8ου Δημοτικού Αγίας Παρασκευής.",
  },
  { slug: "diafora-entypa", title: "Διάφορα Έντυπα", wp: 37 },
  {
    slug: "scholiki-zoi",
    title: "Σχολική Ζωή",
    wp: 30,
    subtitle:
      "Εκδηλώσεις, εκπαιδευτικές επισκέψεις, δράσεις και όλα όσα κάνουν την καθημερινότητα του σχολείου μας ξεχωριστή.",
    isSection: true,
  },
  { slug: "kanonismos", title: "Κανονισμός για τους Μαθητές", wp: 17 },
  { slug: "oloimero", title: "Πληροφορίες για το Ολοήμερο", wp: 65 },
  { slug: "scholikes-ekdiloseis", title: "Σχολικές Εκδηλώσεις", wp: 24 },
  {
    slug: "ekpaideftikes-episkepseis",
    title: "Εκπαιδευτικές επισκέψεις",
    wp: 47,
    subtitle: "Το πρόγραμμα των εκπαιδευτικών επισκέψεων ανά τάξη και τρίμηνο.",
  },
  { slug: "draseis", title: "Δράσεις", wp: 1325 },
  { slug: "aitisi-eggrafis", title: "Αίτηση εγγραφής στο σχολείο μας", wp: 987 },
  {
    slug: "epikoinonia",
    title: "Επικοινωνία",
    subtitle: "Είμαστε στη διάθεσή σας για κάθε απορία.",
    showContactDetails: true,
  },
];

/** WordPress pages that are deliberately not migrated. */
export const SKIPPED_WP_PAGES = new Map([
  [2, "WordPress sample page (lorem ipsum)"],
  [61, "placeholder text only"],
  [19, "empty page"],
  [1286, "untitled draft fragment"],
  [1747, "superseded by the current εκπαιδευτικές επισκέψεις page"],
]);

export const NAVIGATION = [
  { label: "Αρχική", href: "/" },
  { label: "Νέα & Ανακοινώσεις", href: "/nea" },
  {
    label: "Το σχολείο μας",
    page: "to-scholeio-mas",
    children: [
      { label: "Μήνυμα της Διεύθυνσης", page: "minyma-tis-diefthynsis" },
      { label: "Γενικές Πληροφορίες", page: "genikes-plirofories" },
      { label: "Διδακτικό Προσωπικό – Ώρες Επικοινωνίας", page: "didaktiko-prosopiko" },
      { label: "Όρια του σχολείου μας", page: "oria-tou-scholeiou" },
      { label: "Διάφορα Έντυπα", page: "diafora-entypa" },
    ],
  },
  {
    label: "Σχολική Ζωή",
    page: "scholiki-zoi",
    children: [
      { label: "Κανονισμός για τους Μαθητές", page: "kanonismos" },
      { label: "Πληροφορίες για το Ολοήμερο", page: "oloimero" },
      { label: "Σχολικές Εκδηλώσεις", page: "scholikes-ekdiloseis" },
      { label: "Εκπαιδευτικές επισκέψεις", page: "ekpaideftikes-episkepseis" },
      { label: "Δράσεις", page: "draseis" },
    ],
  },
  { label: "Σύλλογος Γονέων", href: SCHOOL.parentsAssociationUrl },
  { label: "Επικοινωνία", page: "epikoinonia" },
];

export const QUICK_LINKS = [
  {
    label: "Νέα & Ανακοινώσεις",
    description: "Ό,τι νέο από το σχολείο μας",
    href: "/nea",
    icon: "calendar",
  },
  {
    label: "Διδακτικό Προσωπικό",
    description: "Ώρες επικοινωνίας ανά τμήμα",
    href: "/didaktiko-prosopiko",
    icon: "people",
  },
  {
    label: "Διάφορα Έντυπα",
    description: "Αιτήσεις και δικαιολογητικά",
    href: "/diafora-entypa",
    icon: "document",
  },
  {
    label: "Πληροφορίες για το Ολοήμερο",
    description: "Ώρες αποχώρησης και λειτουργία",
    href: "/oloimero",
    icon: "clock",
  },
  {
    label: "Όρια του σχολείου μας",
    description: "Η σχολική μας περιφέρεια",
    href: "/oria-tou-scholeiou",
    icon: "map",
  },
  {
    label: "Κανονισμός Σχολείου",
    description: "Κανόνες για τους μαθητές μας",
    href: "/kanonismos",
    icon: "info",
  },
];

/** Transcribed from the "Διδακτικό Προσωπικό – Ώρες Επικοινωνίας" page. */
export const STAFF = [
  {
    section: "management",
    role: "Διευθύντρια",
    name: "ΒΕΛΛΟΠΟΥΛΟΥ ΑΝΤΙΓΟΝΗ",
    contactHours: "Κάθε μέρα 08:00 – 14:00",
  },

  { section: "teacher", role: "Α", name: "ΑΛΕΞΑΝΔΡΑ ΚΑΤΣΙΚΑ", contactHours: "Κάθε 3η Πέμπτη του μήνα 13:25 – 14:00" },
  { section: "teacher", role: "Β1", name: "ΑΣΠΑΣΙΑ ΠΑΠΑΔΟΓΕΩΡΓΟΥ", contactHours: "Κάθε πρώτη Πέμπτη του μήνα 12:35 – 13:15" },
  { section: "teacher", role: "Β2", name: "ΜΑΡΙΑ ΟΙΚΟΝΟΜΟΥ", contactHours: "Κάθε Τετάρτη 13:20 – 14:00 (με ραντεβού)" },
  { section: "teacher", role: "Γ1", name: "ΑΡΕΤΗ ΓΚΡΕΚΟΥ", contactHours: "Παρασκευή 11:00 – 11:30 (με ραντεβού)" },
  { section: "teacher", role: "Γ2", name: "ΘΕΟΔΩΣΗ ΣΤΑΥΡΟΥΛΑ", contactHours: "Κατόπιν ραντεβού" },
  {
    section: "teacher",
    role: "Δ1",
    name: "ΔΗΜΗΤΡΑ ΡΟΥΣΟΠΟΥΛΟΥ",
    contactHours: "Κάθε Τετάρτη 11:30 – 12:20 (τηλεφωνικά ή δια ζώσης κατόπιν ραντεβού)",
  },
  {
    section: "teacher",
    role: "Δ2",
    name: "ΕΥΘΥΜΙΑ ΘΑΝΟΥ",
    contactHours:
      "Τελευταία Τρίτη κάθε μήνα 12:00 – 14:00 και τελευταία Τετάρτη του μήνα τηλεφωνικά 12:00 – 13:00",
  },
  { section: "teacher", role: "Ε1", name: "ΜΑΥΡΑ ΜΠΕΛΕΓΡΙΝΟΥ", contactHours: "Κάθε Τρίτη 12:35 – 13:15 (κατόπιν ραντεβού)" },
  { section: "teacher", role: "Ε2", name: "ΘΕΟΔΩΡΑ ΜΑΥΡΟΜΜΑΤΗ", contactHours: "Κάθε Τετάρτη 12:40 – 13:15" },
  { section: "teacher", role: "ΣΤ1", name: "ΠΕΝΥ ΜΩΗΣΗ", contactHours: "Κάθε Παρασκευή 10:15 – 11:15" },
  { section: "teacher", role: "ΣΤ2", name: "ΠΑΝΑΓΙΩΤΗΣ ΚΟΡΑΚΗΣ", contactHours: "Κάθε Πέμπτη 10:00 – 11:30" },

  { section: "specialty", role: "Αγγλικά", name: "ΤΣΑΚΙΡΗ ΧΡΥΣΑΝΘΗ", contactHours: "Κάθε πρώτη Τετάρτη του μήνα 09:00 – 09:45" },
  { section: "specialty", role: "Αγγλικά", name: "ΚΑΔΔΑΣ ΠΑΥΛΟΣ", contactHours: "Κάθε Παρασκευή 13:15 – 14:00" },
  {
    section: "specialty",
    role: "Γαλλικά",
    name: "ΑΡΧΟΝΤΗ ΒΙΚΥ",
    contactHours: "Δευτέρα 09:40 – 10:00 και Παρασκευή 11:30 – 11:45 (τηλεφωνικά)",
  },
  { section: "specialty", role: "Γυμναστική", name: "ΔΕΛΗΓΕΩΡΓΗ ΕΛΕΝΑ", contactHours: "Κάθε πρώτη Πέμπτη του μήνα 10:00 – 10:45" },
  { section: "specialty", role: "Θεατρική Αγωγή", name: "ΡΟΥΜΕΛΛΙΩΤΗ ΡΑΛΛΟΥ", contactHours: "Κάθε πρώτη Παρασκευή του μήνα, 4η ώρα" },
  { section: "specialty", role: "Μουσική", name: "ΠΑΠΑΔΟΠΟΥΛΟΥ ΜΑΡΘΑ", contactHours: "Κάθε Πέμπτη 10:45 – 11:30" },
  { section: "specialty", role: "Πληροφορική", name: "ΚΕΝΤΙΣΤΟΥ ΑΝΝΑ", contactHours: "Κάθε 1η Τρίτη του μήνα 11:00 – 11:30 (τηλεφωνικά)" },

  {
    section: "inclusion",
    role: "Τμήμα Ένταξης",
    name: "ΛΥΜΠΕΡΟΠΟΥΛΟΥ ΠΑΥΛΙΝΑ",
    contactHours: "Κάθε Παρασκευή 08:30 – 09:00 (τηλεφωνικά ή δια ζώσης κατόπιν ραντεβού)",
  },

  { section: "parallel", name: "ΣΩΤΗΡΟΠΟΥΛΟΥ ΑΝΑΣΤΑΣΙΑ", contactHours: "Κατόπιν συνεννόησης με τους γονείς" },
  { section: "parallel", name: "ΖΗΣΙΜΟΠΟΥΛΟΥ ΕΛΕΥΘΕΡΙΑ", contactHours: "Κατόπιν συνεννόησης με τους γονείς" },
  { section: "parallel", name: "ΕΥΓΕΝΙΟΥ ΒΟΥΛΑ", contactHours: "Κατόπιν συνεννόησης με τους γονείς" },
  { section: "parallel", name: "ΒΑΣΙΛΟΥ ΜΥΡΤΩ – ΠΑΝΑΓΙΩΤΑ", contactHours: "Κατόπιν συνεννόησης με τους γονείς" },
];

/** Colour assignment for the WordPress categories we keep. */
export const CATEGORY_ACCENTS = {
  uncategorized: "blue",
  ανακοινώσεις: "rose",
  "γενική-ενημέρωση": "blue",
  πολιτισμός: "violet",
  "θέματα-υγείας": "green",
  πληροφορική: "teal",
  "σχολικές-δραστηριότητες": "amber",
  διακρίσεις: "amber",
  "ιστορική-επέτειος": "rose",
  "παγκόσμιες-ημέρες": "teal",
};

/** The school building photo used as the home page hero. */
export const HERO_IMAGE_URL = "https://www.8dimotikoagp.gr/wp-content/uploads/2020/03/8th-elementary.jpg";
