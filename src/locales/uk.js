import { add } from "@ckeditor/ckeditor5-utils/src/translation-service.js";

const translations = {
    "Equation preview": "Попередній перегляд",
    "Insert equation in TeX format.": "Вставити рівняння у форматі TeX",
    "Display mode": "Розрив рядка",
    "Insert math": "формула",
};

export default function() {
    add("uk", translations);
}