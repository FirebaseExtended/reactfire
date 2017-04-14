import React from 'react';
import './QuoteCard.css';

const QuoteCard = ({ quote, author }) => (
  <div className='quote-card'>
    <p className='quote-card-quote'>"{ quote }"</p>
    <p className='quote-card-author'>{ author }</p>
  </div>
);

export default QuoteCard;
