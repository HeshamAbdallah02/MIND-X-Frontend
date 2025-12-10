// frontend/src/components/training-details/components/sidebar/ContactCard.js
import React from 'react';
import { FiMail, FiPhone } from 'react-icons/fi';

const ContactCard = ({ contactInfo }) => {
    if (!contactInfo?.email && !contactInfo?.phone && !contactInfo?.whatsapp) return null;

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Us</h3>
            <div className="space-y-3">
                {contactInfo.email && (
                    <a
                        href={`mailto:${contactInfo.email}`}
                        className="flex items-center gap-3 text-gray-700 hover:text-[#FBB859] transition-colors"
                    >
                        <FiMail className="flex-shrink-0" />
                        <span>{contactInfo.email}</span>
                    </a>
                )}
                {contactInfo.phone && (
                    <a
                        href={`tel:${contactInfo.phone}`}
                        className="flex items-center gap-3 text-gray-700 hover:text-[#FBB859] transition-colors"
                    >
                        <FiPhone className="flex-shrink-0" />
                        <span>{contactInfo.phone}</span>
                    </a>
                )}
                {contactInfo.whatsapp && (
                    <a
                        href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-gray-700 hover:text-[#FBB859] transition-colors"
                    >
                        <FiPhone className="flex-shrink-0" />
                        <span>WhatsApp: {contactInfo.whatsapp}</span>
                    </a>
                )}
            </div>
        </div>
    );
};

export default ContactCard;
