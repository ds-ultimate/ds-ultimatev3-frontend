
export const INDEX = '/'
export const SERVER = '/:server'
export const WORLD = '/:server/:world'
export const WORLD_PLAYER_CUR = '/:server/:world/players'
export const WORLD_PLAYER_HIST = '/:server/:world/players/ranks'
export const WORLD_ALLY_CUR = '/:server/:world/allys'
export const WORLD_ALLY_HIST = '/:server/:world/allys/ranks'
export const WORLD_CONQUER = '/:server/:world/conquer/:type'
export const WORLD_CONQUER_DAILY = '/:server/:world/conquerDaily'

export const VILLAGE_INFO = '/:server/:world/village/:village' //TODO
export const PLAYER_INFO = '/:server/:world/player/:player' //TODO
export const ALLY_INFO = '/:server/:world/ally/:ally'

export const ALLY_BASH_RANKING = '/:server/:world/ally/:ally/bashRanking'
export const ALLY_CONQUER = '/:server/:world/ally/conquer/:type/:ally'
export const ALLY_ALLY_CHANGES = '/:server/:world/ally/allyChanges/:type/:ally'
