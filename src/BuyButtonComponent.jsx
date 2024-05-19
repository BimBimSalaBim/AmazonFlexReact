import React from 'react';

function BuyButtonComponent() {
  // Paste the stripe-buy-button snippet in your React component
  return (
    <stripe-buy-button
      buy-button-id="{{BUY_BUTTON_ID}}"
      publishable-key={process.env.STRIPE_PUBLISHABLE_KEY}
    >
    </stripe-buy-button>
  );
}

export default BuyButtonComponent;