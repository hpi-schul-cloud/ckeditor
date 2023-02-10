import { add } from "@ckeditor/ckeditor5-utils/src/translation-service.js";

const translations = {
    "Equation preview": "Preview",
    "Display mode": "Line break",
    "Insert math": "Formula",
};

export default function() {
    add("en", translations);
}