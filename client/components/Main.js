import React, { Component } from 'react'
import axios from 'axios'
import HappyBooks from './HappyBooks'
import SadBooks from './SadBooks'
import NeutralBooks from './NeutralBooks'



/**
 * COMPONENT
 */
class Main extends Component {
  constructor() {
    super()
    this.state = {
      books: [],
      view: 'positive'
    }
  }



  handleClick(view) {
    this.setState({
      view: view
    });
  }

  async componentDidMount() {
    const { data } = await axios.get("/api/books");
    this.setState({
      books: data
    })
  }

  render() {
    return (
      <div className='row big-row'>
        <div className="col s6 m4 center ">
          <h2>How Are you feeling today?</h2>
          <button className='but' onClick={this.handleClick.bind(this, 'negative')} type='button'>
            <i name="negative" className="large material-icons">sentiment_very_satisfied</i>
          </button>
          <button className='but' name="neutral" onClick={this.handleClick.bind(this, 'neutral')} type='button'>
            <i className="large material-icons">sentiment_neutral</i>
          </button>
          <button className='but' name="positive" onClick={this.handleClick.bind(this, 'positive')} type='button'>
            <i className="large material-icons">sentiment_very_dissatisfied</i>
          </button>
        </div>
        <div className="col s6 m8 left-container">
          <h2>Your Recommendations</h2>
          <h4>Click A Mood To Get Started! </h4>
          <hr />
          {this.state.view === 'negative' && (<SadBooks books={this.state.books} />)}
          {this.state.view === 'neutral' ? <NeutralBooks books={this.state.books} /> : null}
          {this.state.view === 'positive' ? (<HappyBooks books={this.state.books} />) : null}
        </div>
      </div>
    )
  }
}

export default Main
