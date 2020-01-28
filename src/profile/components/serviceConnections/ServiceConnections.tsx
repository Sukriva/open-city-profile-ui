import React from 'react';
import { useTranslation } from 'react-i18next';
import { loader } from 'graphql.macro';
import { useQuery } from '@apollo/react-hooks';

import responsive from '../../../common/cssHelpers/responsive.module.css';
import Explanation from '../../../common/explanation/Explanation';
import ExpandingPanel from '../../../common/expandingPanel/ExpandingPanel';
import styles from './ServiceConnections.module.css';
import { ServiceConnectionsQuery } from '../../../graphql/generatedTypes';
import getServices from '../../helpers/getServices';

const SERVICE_CONNECTIONS = loader(
  '../../graphql/ServiceConnectionsQuery.graphql'
);

type Props = {};

function ServiceConnections(props: Props) {
  const { t } = useTranslation();
  const { data, loading } = useQuery<ServiceConnectionsQuery>(
    SERVICE_CONNECTIONS
  );
  const services = getServices(data);
  const hasNoServices = !loading && services.length === 0;
  return (
    <div className={styles.serviceConnections}>
      <div className={responsive.maxWidthCentered}>
        <Explanation
          className={styles.pageTitle}
          main={t('serviceConnections.title')}
          small={t('serviceConnections.explanation')}
        />
        {hasNoServices && (
          <p className={styles.empty}>{t('serviceConnections.empty')}</p>
        )}
        {services.map((service, index) => (
          <ExpandingPanel key={index} title={service.title || ''}>
            {service.description}
          </ExpandingPanel>
        ))}
      </div>
    </div>
  );
}

export default ServiceConnections;
