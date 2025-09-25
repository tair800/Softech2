import React, { useState } from 'react';
import { useLanguage } from './contexts/LanguageContext.jsx';
import Spline from '@splinetool/react-spline';
import PageTitle from './components/PageTitle';
import contactPhoneIcon from '/assets/contact-phone.svg';
import contactLocationIcon from '/assets/contact-location.svg';
import contactMailIcon from '/assets/contact-mail.svg';
import './Contact.css';

function Contact() {
    const { language } = useLanguage();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [splineError, setSplineError] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5098/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setFormData({ name: '', email: '', message: '' });
                setSubmitStatus('success');
            } else {
                setSubmitStatus('error');
            }
        } catch (error) {
            setSubmitStatus('error');
        }
    };

    const t = (key) => {
        const dict = {
            pageTitle: { az: 'Əlaqə', en: 'Contact', ru: 'Контакты' },
            q1: { az: 'Sualınız var?', en: 'Have a question?', ru: 'Есть вопрос?' },
            q2: { az: 'Həllini bilirik', en: 'We know the solution', ru: 'Мы знаем решение' },
            desc: { az: 'Texnoloji tərəfdaşınız olaraq suallarınızı, fikirlərinizi və əməkdaşlıq təkliflərinizi dəyərli sayırıq. Bizimlə əlaqə saxlamaq bir klik uzağınızdadır.', en: 'As your technology partner, we value your questions, ideas, and collaboration proposals. We are just one click away.', ru: 'Как ваш технологический партнер, мы ценим ваши вопросы, идеи и предложения о сотрудничестве. Мы в одном клике от вас.' },
            phone: { az: 'Telefon', en: 'Phone', ru: 'Телефон' },
            email: { az: 'Elektron poçt', en: 'Email', ru: 'Электронная почта' },
            location: { az: 'Məkan', en: 'Location', ru: 'Местоположение' },
            yourInfo: { az: 'Sizin məlumatlarınız', en: 'Your information', ru: 'Ваша информация' },
            nameLabel: { az: 'Adınız', en: 'Your name', ru: 'Ваше имя' },
            namePh: { az: 'Sənin adın', en: 'Your name', ru: 'Ваше имя' },
            emailLabel: { az: 'Elektron poçt', en: 'Email', ru: 'Электронная почта' },
            emailPh: { az: 'Sənin elektron poçtun', en: 'Your email', ru: 'Ваш email' },
            subjectLabel: { az: 'Mövzu', en: 'Subject', ru: 'Тема' },
            subjectPh: { az: 'Mesajın mövzusu', en: 'Message subject', ru: 'Тема сообщения' },
            messageLabel: { az: 'Şərh / Sual', en: 'Comment / Question', ru: 'Комментарий / Вопрос' },
            messagePh: { az: 'Mesajın', en: 'Your message', ru: 'Ваше сообщение' },
            send: { az: 'Göndər', en: 'Send', ru: 'Отправить' }
        };
        return (dict[key] && (dict[key][language] || dict[key].az)) || key;
    };

    return (
        <div className="contact-container">
            <PageTitle title={t('pageTitle')} customClass="page-title-contact" />
            <div className="contact-circle-background-left"></div>
            <div className="contact-circle-background-right"></div>

            <div className="contact-center">
                <div className="contact-rainbow">
                    {!splineError ? (
                        <Spline
                            scene="https://prod.spline.design/mP2TljaQ-tsNIzZt/scene.splinecode"
                            onError={(error) => {
                                setSplineError(true);
                            }}
                        />
                    ) : (
                        <div className="spline-fallback">
                            <img src="/assets/rainbow.png" alt="Rainbow" />
                        </div>
                    )}
                </div>
            </div>

            <div className="contact-main-section">
                <div className="contact-left-section">
                    <div className="contact-content">
                        <div className="contact-heading">
                            <h1 className="heading-line-1">{t('q1')}</h1>
                            <h1 className="heading-line-2">{t('q2')}</h1>
                        </div>
                        <div className="contact-description">
                            <p>{t('desc')}</p>
                        </div>
                        <div className="contact-location">
                            <a href="https://maps.google.com/maps?q=1+Ahmad+Rajabli,+Baku,+Azerbaijan" target="_blank" rel="noopener noreferrer">
                                <span>1 Ahmad Rajabli, Baku, Azerbaijan</span>
                            </a>
                        </div>
                        <div className="contact-info">
                            <div className="contact-item">
                                <div className="contact-icon">
                                    <img src={contactPhoneIcon} alt={t('phone')} />
                                </div>
                                <span>+994 55 274 23 03 <br />
                                    +994 51 252 15 56</span>
                            </div>

                            <div className="contact-item">
                                <div className="contact-icon">
                                    <img src={contactMailIcon} alt={t('email')} />
                                </div>
                                <span>cavidn@softech.az</span>
                            </div>
                            <div className="contact-item">
                                <div className="contact-icon">
                                    <img src={contactLocationIcon} alt={t('location')} />
                                </div>
                                <span>Baku</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="contact-right-section">
                    <div className="contact-form-container">
                        <h2>{t('yourInfo')}</h2>
                        <form onSubmit={handleSubmit} className="contact-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="name">{t('nameLabel')} <span className="required">*</span></label>
                                    <input type="text" id="name" name="name" placeholder={t('namePh')} value={formData.name} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">{t('emailLabel')} <span className="required">*</span></label>
                                    <input type="email" id="email" name="email" placeholder={t('emailPh')} value={formData.email} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="subject">{t('subjectLabel')} <span className="required">*</span></label>
                                <input type="text" id="subject" name="subject" placeholder={t('subjectPh')} value={formData.subject} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="message">{t('messageLabel')} <span className="required">*</span></label>
                                <textarea id="message" name="message" placeholder={t('messagePh')} value={formData.message} onChange={handleChange} required />
                            </div>
                            <button type="submit" className="submit-btn">{t('send')}</button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="contact-map">
                <iframe
                    src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=1+Ahmad+Rajabli,Baku,Azerbaijan"
                    width="100%"
                    height="400"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Softech Location - 1 Ahmad Rajabli, Baku, Azerbaijan"
                ></iframe>
            </div>
        </div>
    );
}

export default Contact;

