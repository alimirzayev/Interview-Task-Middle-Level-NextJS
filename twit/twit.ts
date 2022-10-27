var Twit = require('twit')
 
var T = new Twit({
  consumer_key:         'IpVddsseJm9tuLIQe8ronv5Ae',
  consumer_secret:      'lBOwFakCCulCg8ky8Co7nYmWlHoSUhcwxPc7G3wuffyxdRLTV5',
  access_token:         '1584900286648303616-fZLxoxGlCEirtOB0suequFpfkMZw7b',
  access_token_secret:  'UCMGGpw4HFSI67hjjBMWlwYhRRkG0DQEfH8WSFyKKcYlp',
//   timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
//   strictSSL:            true,     // optional - requires SSL certificates to be valid.
})

export default T