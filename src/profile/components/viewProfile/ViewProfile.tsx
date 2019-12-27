import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { loader } from 'graphql.macro';
import { useTranslation } from 'react-i18next';
import { Switch, Route, NavLink } from 'react-router-dom';
import classNames from 'classnames';

import styles from './ViewProfile.module.css';
import responsive from '../../../common/cssHelpers/responsive.module.css';
import PageHeading from '../../../common/pageHeading/PageHeading';
import ProfileInformation from '../profileInformation/ProfileInformation';
import EditProfile from '../editProfile/EditProfile';
import getNicknameOrName from '../../helpers/getNicknameOrName';
import { MyProfileQuery } from '../../graphql/__generated__/MyProfileQuery';

const MY_PROFILE = loader('../../graphql/MyProfileQuery.graphql');

function ViewProfile() {
  const [isEditing, setEditing] = useState(false);
  const [editedData, setEditedData] = useState<MyProfileQuery>();
  const { t } = useTranslation();
  const { data, loading } = useQuery<MyProfileQuery>(MY_PROFILE);

  const toggleEditing = () => {
    setEditing(true);
  };

  const closeEditing = (updatedProfile: MyProfileQuery) => {
    setEditedData(updatedProfile);
    setEditing(false);
  };

  return (
    <div className={styles.viewProfile}>
      {data && (
        <React.Fragment>
          <PageHeading
            text={getNicknameOrName(editedData ? editedData : data)}
            className={responsive.maxWidthCentered}
          />
          <nav
            className={classNames(
              styles.profileNav,
              responsive.maxWidthCentered
            )}
          >
            <NavLink
              exact
              to="/"
              className={styles.profileNavLink}
              activeClassName={styles.activeProfileNavLink}
            >
              {t('nav.information')}
            </NavLink>
            <NavLink
              exact
              to="/connected-services"
              className={styles.profileNavLink}
              activeClassName={styles.activeProfileNavLink}
            >
              {t('nav.services')}
            </NavLink>
          </nav>
          <Switch>
            <Route path="/connected-services">services</Route>
            <Route path="/">
              <div className={styles.profileContent}>
                <div className={responsive.maxWidthCentered}>
                  <h2 className={styles.title}>
                    {t('profileInformation.title')}
                  </h2>
                  {!isEditing ? (
                    <ProfileInformation
                      data={editedData ? editedData : data}
                      loading={loading}
                      isEditing={isEditing}
                      setEditing={toggleEditing}
                    />
                  ) : (
                    <EditProfile
                      setEditing={closeEditing}
                      profileData={editedData ? editedData : data}
                    />
                  )}
                </div>
              </div>
            </Route>
          </Switch>
        </React.Fragment>
      )}
    </div>
  );
}

export default ViewProfile;
