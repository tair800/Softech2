// Simple translator utility using Azure Translator Text API v3.0
// Configure Vite env vars: VITE_AZURE_TRANSLATOR_KEY, VITE_AZURE_TRANSLATOR_REGION, VITE_AZURE_TRANSLATOR_ENDPOINT

const ENDPOINT = import.meta.env.VITE_AZURE_TRANSLATOR_ENDPOINT || 'https://api.cognitive.microsofttranslator.com';
const API_KEY = import.meta.env.VITE_AZURE_TRANSLATOR_KEY;
const REGION = import.meta.env.VITE_AZURE_TRANSLATOR_REGION;

// Disabled free fallback providers to avoid 429 noise.

function basicDictionaryTranslate(text, to) {
    const dict = {
        en: {
            'Haqqımızda': 'About us',
            'Kollektiv': 'Team',
            'Referance': 'References',
            'director': 'director',
        },
        ru: {
            'Haqqımızda': 'О нас',
            'Kollektiv': 'Коллектив',
            'Referance': 'Референсы',
            'director': 'директор',
        },
    };
    const table = dict?.[to];
    if (!table) return text;
    return table[text] || text;
}

async function translateText(text, to) {
    if (!text || !to) return text;
    if (!API_KEY) return text; // no client translation when no Azure key

    try {
        const url = `${ENDPOINT}/translate?api-version=3.0&to=${encodeURIComponent(to)}`;
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': API_KEY,
                ...(REGION ? { 'Ocp-Apim-Subscription-Region': REGION } : {}),
            },
            body: JSON.stringify([{ Text: text }]),
        });
        if (!res.ok) return text;
        const data = await res.json();
        const translated = data?.[0]?.translations?.[0]?.text;
        return translated || text;
    } catch (e) {
        return text;
    }
}

export async function translateMany(texts, to) {
    if (!Array.isArray(texts)) return [];
    if (!API_KEY) return texts; // no-op without Azure key
    try {
        const url = `${ENDPOINT}/translate?api-version=3.0&to=${encodeURIComponent(to)}`;
        const body = texts.map(t => ({ Text: t || '' }));
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': API_KEY,
                ...(REGION ? { 'Ocp-Apim-Subscription-Region': REGION } : {}),
            },
            body: JSON.stringify(body),
        });
        if (!res.ok) return texts;
        const data = await res.json();
        return data.map(x => x?.translations?.[0]?.text || '');
    } catch (e) {
        return texts.map(t => basicDictionaryTranslate(t, to));
    }
}

export default translateText;


