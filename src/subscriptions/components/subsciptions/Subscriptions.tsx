import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { loader } from 'graphql.macro';
import { useQuery, useMutation } from '@apollo/react-hooks';

import Explanation from '../../../common/explanation/Explanation';
import Button from '../../../common/button/Button';
import Checkbox from '../../../common/checkbox/Checkbox';
import NotificationComponent from '../../../common/notification/NotificationComponent';
import Loading from '../../../common/loading/Loading';
import responsive from '../../../common/cssHelpers/responsive.module.css';
import styles from './Subscriptions.module.css';
import {
  QuerySubscriptions,
  QueryMySubscriptions,
  UpdateMyProfile,
  UpdateMyProfileVariables,
} from '../../../graphql/generatedTypes';
import getSubscriptionsData from '../../helpers/getSubscriptionsData';

const QUERY_SUBSCRIPTIONS = loader('../../graphql/QuerySubscriptions.graphql');
const QUERY_MY_SUBSCRIPTIONS = loader(
  '../../graphql/QueryMySubscriptions.graphql'
);
const UPDATE_PROFILE = loader(
  '../../../profile/graphql/UpdateMyProfile.graphql'
);

type SubscriptionOption = {
  label?: string | null;
  id?: string;
  enabled?: boolean;
  code?: string;
};

type SubscriptionData = {
  id?: string;
  code?: string;
  label?: string | null;
  options?: SubscriptionOption[];
};

type SubscriptionVariable = {
  subscriptionTypeId?: string;
  enabled?: boolean;
};

function Subscriptions() {
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [subscriptionData, setSubscriptionData] = useState<
    SubscriptionData[]
  >();
  const { t } = useTranslation();

  const { data, loading } = useQuery<QuerySubscriptions>(QUERY_SUBSCRIPTIONS, {
    onError: () => setShowNotification(true),
  });

  const { data: profileData, loading: profileLoading } = useQuery<
    QueryMySubscriptions
  >(QUERY_MY_SUBSCRIPTIONS);

  const [updateSubscriptions] = useMutation<
    UpdateMyProfile,
    UpdateMyProfileVariables
  >(UPDATE_PROFILE);

  useEffect(() => {
    if (!subscriptionData && !loading && !profileLoading) {
      const subscriptions = getSubscriptionsData(data, profileData);
      setSubscriptionData(subscriptions);
    }
  }, [data, profileData, subscriptionData, loading, profileLoading]);

  const getSubscriptionVariables = () => {
    const subscriptionVariables: SubscriptionVariable[] = [];

    subscriptionData?.forEach(subscription => {
      subscription?.options?.forEach(option => {
        subscriptionVariables.push({
          subscriptionTypeId: option.id,
          enabled: option.enabled,
        });
      });
    });

    return subscriptionVariables;
  };

  const handleUpdate = () => {
    const variables: UpdateMyProfileVariables = {
      input: {
        profile: {
          subscriptions: getSubscriptionVariables(),
        },
      },
    };

    updateSubscriptions({ variables }).catch((error: Error) =>
      setShowNotification(true)
    );
  };

  const handleCheckboxValues = (
    index: number,
    code?: string,
    value?: boolean
  ) => {
    const newSubscriptionData = subscriptionData || [];

    const subscription = newSubscriptionData[index]?.options?.find(
      option => option.code === code
    );
    if (subscription) {
      subscription.enabled = !value;

      const subscriptionIndex = newSubscriptionData[index]?.options?.indexOf(
        subscription
      );

      if (subscriptionIndex !== undefined) {
        newSubscriptionData[index]?.options?.splice(
          subscriptionIndex,
          1,
          subscription
        );
        setSubscriptionData([...newSubscriptionData]);
      }
    }
  };

  return (
    <Loading
      isLoading={loading || profileLoading}
      loadingText={t('loading')}
      loadingClassName={styles.loading}
    >
      <div className={styles.subscriptionsPage}>
        <div className={responsive.maxWidthCentered}>
          <Explanation
            className={styles.pageTitle}
            main={t('subscriptions.title')}
            small={t('subscriptions.explanation')}
          />

          {subscriptionData?.length === 0 && (
            <p className={styles.empty}>{t('subscriptions.empty')}</p>
          )}
          {subscriptionData && subscriptionData.length > 0 && (
            <div className={styles.subscriptionsContainer}>
              {subscriptionData.map(
                (subscription: SubscriptionData, index: number) => (
                  <div key={subscription.code} className={styles.subscription}>
                    <h3>{subscription.label}</h3>
                    {subscription?.options?.map(
                      (option: SubscriptionOption) => (
                        <Checkbox
                          onChange={() =>
                            handleCheckboxValues(
                              index,
                              option.code,
                              option.enabled
                            )
                          }
                          name={option.code}
                          checked={option.enabled}
                          label={option.label}
                          key={option.code}
                        />
                      )
                    )}
                  </div>
                )
              )}

              <div className={styles.buttonRow}>
                <Button onClick={handleUpdate}>
                  {t('profileForm.submit')}
                </Button>
                <Button className={styles.button} variant="outlined">
                  {t('profileForm.cancel')}
                </Button>
              </div>
            </div>
          )}
        </div>

        <NotificationComponent
          show={showNotification}
          onClose={() => setShowNotification(false)}
        />
      </div>
    </Loading>
  );
}

export default Subscriptions;
