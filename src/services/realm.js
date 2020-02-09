import Realm from 'realm';

import RepositorySchema from '../schemas/RepositorySchema';

export default function GetRealm () {
  return new Realm({
    schema: [RepositorySchema],
  });
}

