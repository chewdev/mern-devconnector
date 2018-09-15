import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import PropTypes from "prop-types";
import TextFieldGroup from "../common/TextFieldGroup";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import InputGroup from "../common/InputGroup";
import SelectListGroup from "../common/SelectListGroup";
import { createProfile, getCurrentProfile } from "../../actions/profileActions";
import isEmpty from "../../validation/is-empty";

class CreateProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displaySocialInputs: false,
      handle: "",
      company: "",
      website: "https://www.",
      location: "",
      status: "",
      skills: "",
      githubusername: "",
      bio: "",
      twitter: "https://www.twitter.com/",
      facebook: "https://www.facebook.com/",
      linkedin: "https://www.linkedin.com/in/",
      youtube: "https://www.youtube.com/",
      instagram: "https://www.instagram.com/",
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.props.getCurrentProfile();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }

    if (nextProps.profile.profile) {
      const profile = nextProps.profile.profile;

      // Bring skills array back to CSV
      const skillsCSV = profile.skills.join(",");

      // If profile field doesn't exist, make it an empty string
      profile.company = !isEmpty(profile.company) ? profile.company : "";
      profile.website = !isEmpty(profile.website)
        ? profile.website.startsWith("https://www.")
          ? profile.website
          : "https://www."
        : "https://www.";
      profile.location = !isEmpty(profile.location) ? profile.location : "";
      profile.githubusername = !isEmpty(profile.githubusername)
        ? profile.githubusername
        : "";
      profile.bio = !isEmpty(profile.bio) ? profile.bio : "";
      profile.social = !isEmpty(profile.social) ? profile.social : {};
      profile.twitter = !isEmpty(profile.social.twitter)
        ? profile.social.twitter.startsWith("https://www.twitter.com/")
          ? profile.social.twitter
          : "https://www.twitter.com/"
        : "https://www.twitter.com/";
      profile.facebook = !isEmpty(profile.social.facebook)
        ? profile.social.facebook.startsWith("https://www.facebook.com/")
          ? profile.social.facebook
          : "https://www.facebook.com/"
        : "https://www.facebook.com/";
      profile.linkedin = !isEmpty(profile.social.linkedin)
        ? profile.social.linkedin.startsWith("https://www.linkedin.com/in/")
          ? profile.social.linkedin
          : "https://www.linkedin.com/in/"
        : "https://www.linkedin.com/in/";
      profile.youtube = !isEmpty(profile.social.youtube)
        ? profile.social.youtube.startsWith("https://www.youtube.com/")
          ? profile.social.youtube
          : "https://www.youtube.com/"
        : "https://www.youtube.com/";
      profile.instagram = !isEmpty(profile.social.instagram)
        ? profile.social.instagram.startsWith("https://www.instagram.com/")
          ? profile.social.instagram
          : "https://www.instagram.com/"
        : "https://www.instagram.com/";

      // Set component fields state
      this.setState({
        handle: profile.handle,
        company: profile.company,
        website: profile.website,
        location: profile.location,
        status: profile.status,
        skills: skillsCSV,
        githubusername: profile.githubusername,
        bio: profile.bio,
        twitter: profile.twitter,
        facebook: profile.facebook,
        linkedin: profile.linkedin,
        youtube: profile.youtube,
        instagram: profile.instagram
      });
    }
  }

  onSubmit(e) {
    e.preventDefault();

    const profileData = {
      handle: this.state.handle,
      company: this.state.company,
      website: this.state.website,
      location: this.state.location,
      status: this.state.status,
      skills: this.state.skills,
      githubusername: this.state.githubusername,
      bio: this.state.bio,
      twitter: this.state.twitter,
      facebook: this.state.facebook,
      linkedin: this.state.linkedin,
      youtube: this.state.youtube,
      instagram: this.state.instagram
    };

    this.props.createProfile(profileData, this.props.history);
  }

  onChange(e) {
    const socials = ["twitter", "facebook", "linkedin", "youtube", "instagram"];

    if (socials.indexOf(e.target.name) !== -1) {
      let socialStr = `https://www.${e.target.name}.com/`;
      if (e.target.name === "linkedin") {
        socialStr = socialStr.concat("in/");
      }
      if (!e.target.value.startsWith(socialStr)) {
        this.setState({ [e.target.name]: socialStr });
        return;
      }
    }

    if (e.target.name === "website") {
      if (!e.target.value.startsWith("https://www.")) {
        this.setState({ website: "https://www." });
        return;
      }
    }
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors, displaySocialInputs } = this.state;

    let socialInputs = displaySocialInputs ? (
      <div>
        <InputGroup
          placeholder="Twitter Profile URL"
          name="twitter"
          icon="fab fa-twitter"
          value={this.state.twitter}
          onChange={this.onChange}
          error={errors.twitter}
        />
        <InputGroup
          placeholder="Facebook Page URL"
          name="facebook"
          icon="fab fa-facebook"
          value={this.state.facebook}
          onChange={this.onChange}
          error={errors.facebook}
        />
        <InputGroup
          placeholder="Linkedin Profile URL"
          name="linkedin"
          icon="fab fa-linkedin"
          value={this.state.linkedin}
          onChange={this.onChange}
          error={errors.linkedin}
        />
        <InputGroup
          placeholder="YouTube Channel URL"
          name="youtube"
          icon="fab fa-youtube"
          value={this.state.youtube}
          onChange={this.onChange}
          error={errors.youtube}
        />
        <InputGroup
          placeholder="Instagram Page URL"
          name="instagram"
          icon="fab fa-instagram"
          value={this.state.instagram}
          onChange={this.onChange}
          error={errors.instagram}
        />
      </div>
    ) : null;

    // Select options for status
    const options = [
      {
        label: "* Select Professional Status",
        value: 0
      },
      {
        label: "Developer",
        value: "Developer"
      },
      {
        label: "Junior Developer",
        value: "Junior Developer"
      },
      {
        label: "Senior Developer",
        value: "Senior Developer"
      },
      {
        label: "Manager",
        value: "Manager"
      },
      {
        label: "Student or Learning",
        value: "Student or Learning"
      },
      {
        label: "Instructor or Teacher",
        value: "Instructor or Teacher"
      },
      {
        label: "Intern",
        value: "Intern"
      },
      {
        label: "Other",
        value: "Other"
      }
    ];

    return (
      <div className="create-profile">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <Link to="/dashboard" className="btn btn-light">
                Go Back
              </Link>
              <h1 className="display-4 text-center">Edit Profile</h1>
              <small className="d-block pb-3">* = required fields</small>
              <form onSubmit={this.onSubmit}>
                <TextFieldGroup
                  placeholder="* Profile Handle"
                  name="handle"
                  value={this.state.handle}
                  onChange={this.onChange}
                  error={errors.handle}
                  info="A unique handle for your profile URL. Your full name, company name, nickname..."
                />
                <SelectListGroup
                  name="status"
                  value={this.state.status}
                  onChange={this.onChange}
                  error={errors.status}
                  options={options}
                  info="Give us an idea where you are at in your career"
                />
                <TextFieldGroup
                  placeholder="Company"
                  name="company"
                  value={this.state.company}
                  onChange={this.onChange}
                  error={errors.company}
                  info="Your own company or the company where you're employed"
                />
                <TextFieldGroup
                  placeholder="Website"
                  name="website"
                  value={this.state.website}
                  onChange={this.onChange}
                  error={errors.website}
                  info="Your own website or a company one"
                />
                <TextFieldGroup
                  placeholder="Location"
                  name="location"
                  value={this.state.location}
                  onChange={this.onChange}
                  error={errors.location}
                  info="City or city & state suggested (eg. Los Angeles, CA)"
                />
                <TextFieldGroup
                  placeholder="* Skills"
                  name="skills"
                  value={this.state.skills}
                  onChange={this.onChange}
                  error={errors.skills}
                  info="Please use comma separated values (eg. HTML,CSS,JavaScript,React)"
                />
                <TextFieldGroup
                  placeholder="Github Username"
                  name="githubusername"
                  value={this.state.githubusername}
                  onChange={this.onChange}
                  error={errors.githubusername}
                  info="If you want your latest repos and a Github link, include your username"
                />
                <TextAreaFieldGroup
                  placeholder="Short Bio"
                  name="bio"
                  value={this.state.bio}
                  onChange={this.onChange}
                  error={errors.bio}
                  info="Tell us a little about yourself"
                />

                <div className="mb-3">
                  <button
                    type="button"
                    onClick={() => {
                      this.setState(prevState => ({
                        displaySocialInputs: !prevState.displaySocialInputs
                      }));
                    }}
                    className="btn btn-light"
                  >
                    Add Social Network Links
                  </button>
                  <span className="text-muted">Optional</span>
                </div>
                {socialInputs}
                <input
                  type="submit"
                  value="submit"
                  className="btn btn-info btn-block mt-4"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CreateProfile.propTypes = {
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  createProfile: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { createProfile, getCurrentProfile }
)(withRouter(CreateProfile));
