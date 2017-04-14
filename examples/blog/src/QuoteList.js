import * as firebase from 'firebase';
import React, { Component } from 'react';
import { createDatabaseContainer } from '../vendor';

import './QuoteList.css';

import QuoteCard from './QuoteCard.js';


class QuoteList extends Component {
  render() {
    const { quotes } = this.props;

    // if (quotes === null) {
    //   return <div>Loading...</div>;
    // } else if (quotes.length === 0) {
    //   return <div>No quotes.</div>;
    // }

    // const quotesContent = quotes.map((item) => {
    //   return (
    //     <QuoteCard
    //       author={item.author}
    //       quote={item.quote}
    //       key={item['.key']}>
    //     </QuoteCard>
    //   );
    // });

    // return (
    //   <div className='quote-list'>
    //     {quotesContent}
    //   </div>
    // );

    console.log('QUOTES:', quotes);

    if (!quotes.isLoaded) {
      return <div>Loading...</div>;
    } else if (quotes.value.length === 0) {
      return <div>No quotes.</div>;
    }

    const quotesContent = quotes.value.map((item) => {
      const { author, quote } = item.value;
      return (
        <QuoteCard
          author={author}
          quote={quote}
          key={item.key}>
        </QuoteCard>
      );
    });

    return (
      <div className='quote-list'>
        {quotesContent}
      </div>
    );
  }
}


// const QuoteListWithSubscription = createAuthContainer(createDatabaseContainer(QuoteList, (props) => {
//   return {
//     quotes: firebase.database().ref('quotes').limitToLast(props.limit)
//   };
// }));

const QuoteListWithSubscription = createDatabaseContainer(QuoteList, (props) => {
  return {
    quotes: {
      ref: firebase.database().ref('quotes').limitToLast(props.limit),
      asArray: true
    },
    other: firebase.database().ref('other')
  };
});

export default QuoteListWithSubscription;
