const messages = {
    az: {
        home: 'Əsas Səhifə',
        about: 'Haqqımızda',
        products: 'Məhsullar',
        categories: 'Kategoriyalar',
        services: 'Xidmətlər',
        equipment: 'Avadanlıqlar',
        blog: 'Bloq',
        contact: 'Əlaqə',
        team: 'Kollektiv',
        references: 'Referanslar',
    },
    en: {
        home: 'Home',
        about: 'About',
        products: 'Products',
        categories: 'Categories',
        services: 'Services',
        equipment: 'Equipment',
        blog: 'Blog',
        contact: 'Contact',
        team: 'Team',
        references: 'References',
    },
    ru: {
        home: 'Главная',
        about: 'О нас',
        products: 'Продукты',
        categories: 'Категории',
        services: 'Услуги',
        equipment: 'Оборудование',
        blog: 'Блог',
        contact: 'Контакты',
        team: 'Коллектив',
        references: 'Референсы',
    },
};

export function t(key, lang = 'az') {
    const table = messages[lang] || messages.az;
    return table[key] || key;
}

export default messages;


