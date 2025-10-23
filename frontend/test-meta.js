// Test script for meta descriptions utility
// This can be run in the browser console to test our meta descriptions

// Import the utility functions (this would normally be done via import statements)
// For testing purposes, we'll simulate the functions

const LANGUAGES = {
    AZ: 'az',
    EN: 'en',
    RU: 'ru'
};

const META_DESCRIPTIONS = {
    home: {
        [LANGUAGES.AZ]: 'Softech - Müasir texnologiyalar və innovativ həllər. Avadanlıq, xidmət və məhsul satışı. Keyfiyyətli texniki həllər və professional xidmət.',
        [LANGUAGES.EN]: 'Softech - Modern technologies and innovative solutions. Equipment, service and product sales. Quality technical solutions and professional service.',
        [LANGUAGES.RU]: 'Softech - Современные технологии и инновационные решения. Продажа оборудования, услуг и продукции. Качественные технические решения и профессиональное обслуживание.'
    },
    about: {
        [LANGUAGES.AZ]: 'Softech haqqında - Komandamız, missiyamız və dəyərlərimiz. Texnologiya sahəsində təcrübə və keyfiyyətli xidmət.',
        [LANGUAGES.EN]: 'About Softech - Our team, mission and values. Experience in technology field and quality service.',
        [LANGUAGES.RU]: 'О Softech - Наша команда, миссия и ценности. Опыт в области технологий и качественное обслуживание.'
    }
};

const getMetaDescription = (page, language = LANGUAGES.AZ) => {
    const pageDescriptions = META_DESCRIPTIONS[page];
    if (!pageDescriptions) {
        console.warn(`No meta descriptions found for page: ${page}`);
        return META_DESCRIPTIONS.home[language] || META_DESCRIPTIONS.home[LANGUAGES.AZ];
    }

    return pageDescriptions[language] || pageDescriptions[LANGUAGES.AZ];
};

// Test the meta descriptions
console.log('=== Testing Meta Descriptions ===');
console.log('Home AZ:', getMetaDescription('home', 'az'));
console.log('Home EN:', getMetaDescription('home', 'en'));
console.log('Home RU:', getMetaDescription('home', 'ru'));
console.log('About AZ:', getMetaDescription('about', 'az'));
console.log('About EN:', getMetaDescription('about', 'en'));
console.log('About RU:', getMetaDescription('about', 'ru'));

// Test length validation
const testDescription = getMetaDescription('home', 'az');
console.log('Description length:', testDescription.length);
console.log('Is within SEO limits (160 chars):', testDescription.length <= 160);

console.log('=== Meta Descriptions Test Complete ===');
