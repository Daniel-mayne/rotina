import { cacheConfig } from '@melchyore/adonis-cache/build/config'

export default cacheConfig({
  prefix: 'cache:',

  store: 'redis',

  stores: {
    /*
    |--------------------------------------------------------------------------
    | Redis store
    |--------------------------------------------------------------------------
    |
    | Use this store to store cache in redis. By default,
    | it will use the default redis connection from the
    | environment variables.
    | You can specify another connection by adding the `connection`
    | property to the `redis` object as follows:
    | connection: 'my-other-connection-name',
    |
    */
    redis: {
      driver: 'redis',
      connection: 'cache'
    },
  },

  /*
  |--------------------------------------------------------------------------
  | Time to live (TTL)
  |--------------------------------------------------------------------------
  |
  | TTL is expressed in seconds.
  | 
  */
  ttl: 60,

  /*
  |--------------------------------------------------------------------------
  | Cache events
  |--------------------------------------------------------------------------
  |
  | Enable/disable cache events.
  | 
  */
  events: {
    'cache:hit': true,
    'cache:missed': true,
    'cache:key_written': true,
    'cache:key_forgotten': true
  }
})
