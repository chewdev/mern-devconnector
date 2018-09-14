import React, { Component } from "react";
import isEmpty from "../../validation/is-empty";

class ProfileHeader extends Component {
  render() {
    const { profile } = this.props;

    const valWebsite =
      !isEmpty(profile.website) && /^https:\/\/www.[\S]+/.test(profile.website);
    const valTwitter =
      !isEmpty(profile.social && profile.social.twitter) &&
      /^https:\/\/www.twitter.com\/[\S]+/.test(profile.social.twitter);
    const valFacebook =
      !isEmpty(profile.social && profile.social.facebook) &&
      /^https:\/\/www.facebook.com\/[\S]+/.test(profile.social.facebook);
    const valLinkedin =
      !isEmpty(profile.social && profile.social.linkedin) &&
      /^https:\/\/www.linkedin.com\/in\/[\S]+/.test(profile.social.linkedin);
    const valYoutube =
      !isEmpty(profile.social && profile.social.youtube) &&
      /^https:\/\/www.youtube.com\/[\S]+/.test(profile.social.youtube);
    const valInstagram =
      !isEmpty(profile.social && profile.social.instagram) &&
      /^https:\/\/www.instagram.com\/[\S]+/.test(profile.social.instagram);

    return (
      <div className="row">
        <div className="col-md-12">
          <div className="card card-body bg-info text-white mb-3">
            <div className="row">
              <div className="col-4 col-md-3 m-auto">
                <img
                  className="rounded-circle"
                  src={profile.user.avatar}
                  alt={`${profile.user.handle}'s avatar`}
                />
              </div>
            </div>
            <div className="text-center">
              <h1 className="display-4 text-center">{profile.user.name}</h1>
              <p className="lead text-center">
                {profile.status}{" "}
                {isEmpty(profile.company) ? null : (
                  <span>at {profile.company}</span>
                )}
              </p>

              {isEmpty(profile.location) ? null : <p>{profile.location}</p>}

              <p>
                {!valWebsite ? null : (
                  <a
                    className="text-white p-2"
                    href={profile.website}
                    target="_blank"
                  >
                    <i className="fas fa-globe fa-2x" />
                  </a>
                )}
                {!valTwitter ? null : (
                  <a
                    className="text-white p-2"
                    href={profile.social.twitter}
                    target="_blank"
                  >
                    <i className="fab fa-twitter fa-2x" />
                  </a>
                )}
                {!valFacebook ? null : (
                  <a
                    className="text-white p-2"
                    href={profile.social.facebook}
                    target="_blank"
                  >
                    <i className="fab fa-facebook fa-2x" />
                  </a>
                )}
                {!valLinkedin ? null : (
                  <a
                    className="text-white p-2"
                    href={profile.social.linkedin}
                    target="_blank"
                  >
                    <i className="fab fa-linkedin fa-2x" />
                  </a>
                )}
                {!valYoutube ? null : (
                  <a
                    className="text-white p-2"
                    href={profile.social.youtube}
                    target="_blank"
                  >
                    <i className="fab fa-youtube fa-2x" />
                  </a>
                )}
                {!valInstagram ? null : (
                  <a
                    className="text-white p-2"
                    href={profile.social.instagram}
                    target="_blank"
                  >
                    <i className="fab fa-instagram fa-2x" />
                  </a>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProfileHeader;
