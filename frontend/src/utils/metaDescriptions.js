// Meta Languages
export const LANGUAGES = {
    AZ: 'az',
    EN: 'en',
    RU: 'ru'
};

// Meta descriptions for different pages in 3 languages
export const META_DESCRIPTIONS = {
    // Home page
    home: {
        [LANGUAGES.AZ]: 'Softech - Müasir texnologiyalar və innovativ həllər. Avadanlıq, xidmət və məhsul satışı. Keyfiyyətli texniki həllər və professional xidmət.',
        [LANGUAGES.EN]: 'Softech - Modern technologies and innovative solutions. Equipment, service and product sales. Quality technical solutions and professional service.',
        [LANGUAGES.RU]: 'Softech - Современные технологии и инновационные решения. Продажа оборудования, услуг и продукции. Качественные технические решения и профессиональное обслуживание.'
    },

    // About page
    about: {
        [LANGUAGES.AZ]: 'Softech haqqında - Komandamız, missiyamız və dəyərlərimiz. Texnologiya sahəsində təcrübə və keyfiyyətli xidmət.',
        [LANGUAGES.EN]: 'About Softech - Our team, mission and values. Experience in technology field and quality service.',
        [LANGUAGES.RU]: 'О Softech - Наша команда, миссия и ценности. Опыт в области технологий и качественное обслуживание.'
    },

    // Services page
    services: {
        [LANGUAGES.AZ]: 'Softech xidmətləri - Texniki xidmətlər, quraşdırma, təmir və dəstək. Professional texniki həllər və keyfiyyətli xidmət.',
        [LANGUAGES.EN]: 'Softech services - Technical services, installation, repair and support. Professional technical solutions and quality service.',
        [LANGUAGES.RU]: 'Услуги Softech - Технические услуги, установка, ремонт и поддержка. Профессиональные технические решения и качественное обслуживание.'
    },

    // Equipment page
    equipment: {
        [LANGUAGES.AZ]: 'Softech avadanlıqları - Müasir texnoloji avadanlıqlar və sistemlər. Keyfiyyətli avadanlıq satışı və texniki dəstək.',
        [LANGUAGES.EN]: 'Softech equipment - Modern technological equipment and systems. Quality equipment sales and technical support.',
        [LANGUAGES.RU]: 'Оборудование Softech - Современное технологическое оборудование и системы. Продажа качественного оборудования и техническая поддержка.'
    },

    // Products page
    products: {
        [LANGUAGES.AZ]: 'Softech məhsulları - Keyfiyyətli texnoloji məhsullar və həllər. İnnovativ məhsul satışı və texniki dəstək.',
        [LANGUAGES.EN]: 'Softech products - Quality technological products and solutions. Innovative product sales and technical support.',
        [LANGUAGES.RU]: 'Продукция Softech - Качественные технологические продукты и решения. Продажа инновационных продуктов и техническая поддержка.'
    },

    // Blog page
    blog: {
        [LANGUAGES.AZ]: 'Softech blog - Texnologiya xəbərləri, məqalələr və yeniliklər. İndustriya təcrübələri və ekspert məsləhətləri.',
        [LANGUAGES.EN]: 'Softech blog - Technology news, articles and updates. Industry experiences and expert advice.',
        [LANGUAGES.RU]: 'Блог Softech - Новости технологий, статьи и обновления. Опыт отрасли и экспертные советы.'
    },

    // Contact page
    contact: {
        [LANGUAGES.AZ]: 'Softech ilə əlaqə - Əlaqə məlumatları, ünvan və telefon nömrələri. Bizimlə əlaqə saxlayın və məsləhət alın.',
        [LANGUAGES.EN]: 'Contact Softech - Contact information, address and phone numbers. Get in touch with us and get advice.',
        [LANGUAGES.RU]: 'Контакт Softech - Контактная информация, адрес и телефоны. Свяжитесь с нами и получите консультацию.'
    },

    // Factory page
    factory: {
        [LANGUAGES.AZ]: 'Softech zavodu - İstehsal prosesi, keyfiyyət nəzarəti və texnologiya. Müasir istehsal imkanları.',
        [LANGUAGES.EN]: 'Softech factory - Production process, quality control and technology. Modern production facilities.',
        [LANGUAGES.RU]: 'Завод Softech - Производственный процесс, контроль качества и технологии. Современные производственные возможности.'
    }
};

// Function to get meta description for a specific page and language
export const getMetaDescription = (page, language = LANGUAGES.AZ) => {
    const pageDescriptions = META_DESCRIPTIONS[page];
    if (!pageDescriptions) {
        console.warn(`No meta descriptions found for page: ${page}`);
        return META_DESCRIPTIONS.home[language] || META_DESCRIPTIONS.home[LANGUAGES.AZ];
    }

    return pageDescriptions[language] || pageDescriptions[LANGUAGES.AZ];
};

// Function to generate dynamic meta description for detail pages
export const generateDetailMetaDescription = (item, pageType, language = LANGUAGES.AZ) => {
    if (!item) {
        return getMetaDescription(pageType, language);
    }

    const baseDescriptions = {
        service: {
            [LANGUAGES.AZ]: `${item.name || 'Xidmət'} - Softech tərəfindən təqdim edilən professional texniki xidmət. ${item.description || 'Keyfiyyətli texniki həllər və xidmət.'}`,
            [LANGUAGES.EN]: `${item.name || 'Service'} - Professional technical service provided by Softech. ${item.description || 'Quality technical solutions and service.'}`,
            [LANGUAGES.RU]: `${item.name || 'Услуга'} - Профессиональная техническая услуга от Softech. ${item.description || 'Качественные технические решения и обслуживание.'}`
        },
        equipment: {
            [LANGUAGES.AZ]: `${item.name || 'Avadanlıq'} - Softech tərəfindən satılan müasir texnoloji avadanlıq. ${item.description || 'Keyfiyyətli avadanlıq və texniki dəstək.'}`,
            [LANGUAGES.EN]: `${item.name || 'Equipment'} - Modern technological equipment sold by Softech. ${item.description || 'Quality equipment and technical support.'}`,
            [LANGUAGES.RU]: `${item.name || 'Оборудование'} - Современное технологическое оборудование от Softech. ${item.description || 'Качественное оборудование и техническая поддержка.'}`
        },
        product: {
            [LANGUAGES.AZ]: `${item.name || 'Məhsul'} - Softech tərəfindən təqdim edilən keyfiyyətli texnoloji məhsul. ${item.description || 'İnnovativ məhsul və texniki dəstək.'}`,
            [LANGUAGES.EN]: `${item.name || 'Product'} - Quality technological product provided by Softech. ${item.description || 'Innovative product and technical support.'}`,
            [LANGUAGES.RU]: `${item.name || 'Продукт'} - Качественный технологический продукт от Softech. ${item.description || 'Инновационный продукт и техническая поддержка.'}`
        },
        blog: {
            [LANGUAGES.AZ]: `${item.title1 || 'Bloq məqaləsi'} - Softech blog. ${item.desc1 || 'Texnologiya xəbərləri və ekspert məsləhətləri.'}`,
            [LANGUAGES.EN]: `${item.title1 || 'Blog article'} - Softech blog. ${item.desc1 || 'Technology news and expert advice.'}`,
            [LANGUAGES.RU]: `${item.title1 || 'Статья блога'} - Блог Softech. ${item.desc1 || 'Новости технологий и экспертные советы.'}`
        }
    };

    const typeDescriptions = baseDescriptions[pageType];
    if (!typeDescriptions) {
        return getMetaDescription('home', language);
    }

    return typeDescriptions[language] || typeDescriptions[LANGUAGES.AZ];
};

// Function to truncate description to appropriate length for SEO
export const truncateMetaDescription = (description, maxLength = 160) => {
    if (!description || description.length <= maxLength) {
        return description;
    }

    // Truncate at word boundary
    const truncated = description.substring(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(' ');

    if (lastSpaceIndex > maxLength - 20) { // If we can find a space within reasonable distance
        return truncated.substring(0, lastSpaceIndex) + '...';
    }

    return truncated + '...';
};

// Function to get page title for different pages
export const getPageTitle = (page, language = LANGUAGES.AZ) => {
    const titles = {
        home: {
            [LANGUAGES.AZ]: 'Softech - Müasir Texnologiyalar və İnnovativ Həllər',
            [LANGUAGES.EN]: 'Softech - Modern Technologies and Innovative Solutions',
            [LANGUAGES.RU]: 'Softech - Современные Технологии и Инновационные Решения'
        },
        about: {
            [LANGUAGES.AZ]: 'Haqqımızda - Softech',
            [LANGUAGES.EN]: 'About Us - Softech',
            [LANGUAGES.RU]: 'О Нас - Softech'
        },
        services: {
            [LANGUAGES.AZ]: 'Xidmətlər - Softech',
            [LANGUAGES.EN]: 'Services - Softech',
            [LANGUAGES.RU]: 'Услуги - Softech'
        },
        equipment: {
            [LANGUAGES.AZ]: 'Avadanlıqlar - Softech',
            [LANGUAGES.EN]: 'Equipment - Softech',
            [LANGUAGES.RU]: 'Оборудование - Softech'
        },
        products: {
            [LANGUAGES.AZ]: 'Məhsullar - Softech',
            [LANGUAGES.EN]: 'Products - Softech',
            [LANGUAGES.RU]: 'Продукция - Softech'
        },
        blog: {
            [LANGUAGES.AZ]: 'Bloq - Softech',
            [LANGUAGES.EN]: 'Blog - Softech',
            [LANGUAGES.RU]: 'Блог - Softech'
        },
        contact: {
            [LANGUAGES.AZ]: 'Əlaqə - Softech',
            [LANGUAGES.EN]: 'Contact - Softech',
            [LANGUAGES.RU]: 'Контакт - Softech'
        },
        factory: {
            [LANGUAGES.AZ]: 'Zavod - Softech',
            [LANGUAGES.EN]: 'Factory - Softech',
            [LANGUAGES.RU]: 'Завод - Softech'
        }
    };

    const pageTitles = titles[page];
    if (!pageTitles) {
        return titles.home[language] || titles.home[LANGUAGES.AZ];
    }

    return pageTitles[language] || pageTitles[LANGUAGES.AZ];
};

// Function to get dynamic page title for detail pages
export const generateDetailPageTitle = (item, pageType, language = LANGUAGES.AZ) => {
    if (!item) {
        return getPageTitle(pageType, language);
    }

    const itemName = item.name || item.title1 || 'Item';
    const baseTitle = getPageTitle(pageType, language);

    return `${itemName} - ${baseTitle}`;
};
