import React, { Component } from "react";
import PropTypes from "prop-types";
import Spinner from "../common/Spinner";
import axios from "axios";

class ProfileGithub extends Component {
  constructor(props) {
    super(props);
    this.state = {
      repos: [],
      hasRepos: false,
      isLoading: true,
      isMounted: false
    };
  }

  componentDidMount() {
    this.setState({ isMounted: true });
    const { handle } = this.props;
    axios
      .get(`/api/profile/${handle}/github`)
      .then(res => {
        if (
          this.refs.myRef &&
          res.data.repos &&
          res.data.repos.length > 0 &&
          this.state.isMounted
        ) {
          this.setState({
            repos: res.data.repos,
            hasRepos: true,
            isLoading: false
          });
        } else {
          if (this.state.isMounted) {
            this.setState({ isLoading: false });
          }
        }
      })
      .catch(err => console.log(err));
  }

  componentWillUnmount() {
    this.setState({ isMounted: false });
  }

  render() {
    const { repos, hasRepos, isLoading } = this.state;

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

    return isLoading ? (
      <div ref="myRef">
        <hr />
        <Spinner />
      </div>
    ) : hasRepos ? (
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
  username: PropTypes.string.isRequired,
  handle: PropTypes.string.isRequired
};

export default ProfileGithub;
