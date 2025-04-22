// frontend/src/components/home/Footer/components/Subscribe.js
import React, { useState } from 'react';
import { useSettings }    from '../../../../context/BrandSettingsContext';

const Subscribe = () => {
  const { settings } = useSettings();
  const c = settings?.footerColors || {};

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  return (
    <div className="flex flex-col gap-4">
      <h3
        className="text-lg font-semibold"
        style={{ color: c.titleColor }}
      >
        Connect & Subscribe
      </h3>
      <form className="flex flex-col gap-4">
        <input
          type="email"
          required
          placeholder="Your email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full px-4 py-2 rounded-md border border-white/10"
          style={{
            backgroundColor: c.inputBgColor,
            color:           c.inputTextColor
          }}
        />
        <input
          type="tel"
          required
          placeholder="Your mobile number"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          className="w-full px-4 py-2 rounded-md border border-white/10"
          style={{
            backgroundColor: c.inputBgColor,
            color:           c.inputTextColor
          }}
        />
        <button
          type="submit"
          className="w-full py-2 rounded-md font-medium"
          style={{
            backgroundColor: c.buttonBgColor,
            color:           c.buttonTextColor
          }}
        >
          Subscribe
        </button>
      </form>
    </div>
  );
};

export default Subscribe;