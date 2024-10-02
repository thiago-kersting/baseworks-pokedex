import { createI18n } from "vue-i18n";
import en from "@/locales/en.json"
import ptBr from "@/locales/pt-BR.json"


type MessageSchema = typeof en

const i18n = createI18n<[MessageSchema], 'en' | 'pt-BR'>({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'pt-BR',
    messages: {
        en,
        'pt-BR': ptBr
    }
});

export default i18n;