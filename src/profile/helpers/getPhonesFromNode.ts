import {
  MyProfileQuery,
  MyProfileQuery_myProfile_phones_edges_node as Phone,
} from '../../graphql/generatedTypes';

const getPhonesFromNode = (data?: MyProfileQuery): Phone[] => {
  const edges = data?.myProfile?.phones?.edges || [];
  return edges
    .filter(edge => !edge?.node?.primary)
    .map(
      edge =>
        ({
          primary: edge?.node?.primary,
          id: edge?.node?.id,
          phone: edge?.node?.phone,
          phoneType: edge?.node?.phoneType,
          __typename: 'PhoneNode',
        } as Phone)
    );
};

export default getPhonesFromNode;
