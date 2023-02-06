
const INDEX = '/'
const SERVER = '/:server'
const WORLD = '/:server/:world'
const WORLD_PLAYER_CUR = '/:server/:world/players'
const WORLD_PLAYER_HIST = '/:server/:world/players/ranks'
const WORLD_ALLY_CUR = '/:server/:world/allys'
const WORLD_ALLY_HIST = '/:server/:world/allys/ranks'
const WORLD_CONQUER = '/:server/:world/conquer/:type'
const WORLD_CONQUER_DAILY = '/:server/:world/conquerDaily'

const PLAYER_INFO = '/:server/:world/player/:player'
const ALLY_INFO = '/:server/:world/ally/:ally'

export {INDEX, SERVER, WORLD, WORLD_PLAYER_CUR, WORLD_PLAYER_HIST, WORLD_ALLY_CUR, WORLD_ALLY_HIST, WORLD_CONQUER,
  WORLD_CONQUER_DAILY, PLAYER_INFO, ALLY_INFO}
