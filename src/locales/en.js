import { add } from "@ckeditor/ckeditor5-utils/src/translation-service.js";

const translations = {
    "Equation preview": "Preview",
    "Insert equation in TeX format.": "Insert equation in TeX format.",
    "Display mode": "Line break",
    "Insert math": "Formula",
};

export default function() {
    add("en", translations);
}