import React, { Component } from "react";
import PropTypes from "prop-types";

class ProfileGithub extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clientId: process.env.REACT_APP_GITHUB_CLIENT_ID, // Must include Github OAuth Client ID in .env
      clientSecret: process.env.REACT_APP_GITHUB_CLIENT_SECRET, // Must include Github OAuth Client Secret in .env
      count: 5,
      sort: "created: asc",
      repos: [],
      hasRepos: false
    };
  }

  componentDidMount() {
    const { username } = this.props;
    const { count, sort, clientId, clientSecret } = this.state;
    fetch(
      `https://api.github.com/users/${username}/repos?per_page=${count}&sort=${sort}&client_id=${clientId}&client_secret=${clientSecret}`
    )
      .then(res => res.json())
      .then(data => {
        if (this.refs.myRef && data && data.length > 0) {
          this.setState({ repos: data, hasRepos: true });
        }
      })
      .catch(err => console.log(err));
  }

  render() {
    const { repos, hasRepos } = this.state;

    const repoItems = repos.map(repo => (
      <div key={repo.id} className="card card-body mb-2">
        <div className="row">
          <div className="col-md-6">
            <h4>
              <a href={repo.html_url} className="text-info" target="_blank">
                {repo.name}
              </a>
            </h4>
            <p>{repo.description}</p>
          </div>
          <div className="col-md-6">
            <span className="badge badge-info mr-1">
              Stars: {repo.stargazers_count}
            </span>
            <span className="badge badge-secondary mr-1">
              Watchers: {repo.watchers_count}
            </span>
            <span className="badge badge-success">
              Forks: {repo.forks_count}
            </span>
          </div>
        </div>
      </div>
    ));

    return hasRepos ? (
      <div ref="myRef">
        <hr />
        <h3 className="mb-4">Latest Github Repos</h3>
        {repoItems}
      </div>
    ) : (
      <div ref="myRef">
        <hr />
        <h3 className="mb-4">
          This user's Github profile "{this.props.username}" does not have any
          repos or does not exist.
        </h3>
      </div>
    );
  }
}

ProfileGithub.propTypes = {
  username: PropTypes.string.isRequired
};

export default ProfileGithub;
