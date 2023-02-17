import React, { Component } from 'react';
import axios from 'axios'
//import { Link } from 'react-router-dom';

class Fib extends Component {
    state = {
        seen: [],
        values: {},
        index: ''
    }

    componentDidMount() {
        this.fetchValues();
        this.fetchIndexes();
    }

    async fetchValues() {
        const values = await axios.get('/api/values/current');
        this.setState({ values: values.data });
    }

    async fetchIndexes() {
        const seenIndexes = await axios.get('/api/values/all');
        console.log("SEEN:", seenIndexes.data)
        this.setState({ seen: seenIndexes.data });
    }

    renderSeenIndexes() {
        return this.state.seen.map(({ number }) => number).join(", ")
    }

    renderValues() {
        const entries = [];
        for (let key in this.state.values) {
            entries.push(
                <div key={key}>
                    For index {key} I calculated {this.state.values[key]}
                </div>
            );
        }
        return entries;
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post('/api/values', {
            index: this.state.index
        })
        this.setState({ index: '' })
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>Enter your index</label>
                    <input
                        value={this.state.index}
                        onChange={event => this.setState({ index: event.target.value })}
                    />
                    <button>Submit</button>
                </form>
                <div>
                    <h3>Indexes i have seen</h3>
                    {this.renderSeenIndexes()}
                    <h3>Calculated values</h3>
                    {this.renderValues()}
                </div>
            </div>
        )
    }
}

export default Fib;
