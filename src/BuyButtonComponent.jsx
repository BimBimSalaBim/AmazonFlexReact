import React from 'react';

function BuyButtonComponent() {
  // Paste the stripe-buy-button snippet in your React component
  return (
    <stripe-buy-button
      buy-button-id="{{BUY_BUTTON_ID}}"
      publishable-key="pk_test_51O7NtIE8MeFtYXm9WpcSQTWg03Bd8SWjU6eKHMuHzJevRBKdktIMoBsNxh3Ei9jzyStK9p5pFlUm8oXxz57rDKTy004v6MeuVu"
    >
    </stripe-buy-button>
  );
}

export default BuyButtonComponent;