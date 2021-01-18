import React from 'react';
import axios from 'axios';
import urljoin from 'url-join';

class StatsViewer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  async componentDidMount() {
    const response = await axios.get(urljoin(process.env.REACT_APP_SESSION_SVC, "sessions/stats"));
    console.log(response)
  }

  render() {
    return (
      <div>
        <h1>Stats Viewer</h1>
      </div>
    )
  }

};

export default StatsViewer;
