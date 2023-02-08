import { add } from "@ckeditor/ckeditor5-utils/src/translation-service.js";

const translations = {
    "Equation preview": "Formel Vorschau",
    "Insert equation in TeX format.": "Gleichung im TeX-Format einfügen",
    "Display mode": "Zeilenumbruch",
    "Insert math": "Formel",
};

export default function() {
    add("de", translations);
}