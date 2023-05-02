
enum moralEnum {
  INACTIVE = 0,
  POINT_BASED = 1,
  TIME_BASED = 2,
  POINT_AND_TIME_BASED = 3,
}

enum killRankingType {
  NONE = 0,
  OLD_SYSTEM = 1,
  NEW_SYSTEM = 2,
}

enum questType {
  NONE = 0,
  OLD_QUEST_SYSTEM = 4,
  TASK_SYSTEM = 5,
}

enum buildTimeFormulaType {
  FORMULA_2003 = 0,
  FORMULA_2011 = 1,
  FORMULA_2015 = 2,
}

enum knightType {
  DISABLED = 0,
  SINGLE_PALADIN = 1,
  SINGLE_PALADIN_WITH_ITEMS = 2,
  MULTI_SKILLED_PALADIN = 3,
}

enum techSystemType {
  TECHS_10 = 0,
  TECHS_3 = 1,
  SIMPLE = 2,
}

enum haulType {
  OFF = 0,
  ON = 1,
  LIMITED = 2,
  ON_WITH_SCAVENGING = 3, //old not used anymore will be instead ON + scavenging true
}

enum eventType {
  NONE = 0,
  APRIL_FOOL_HATS = 5,
  CASTLE_ASSAULT = 10,
  NOBLE_FAIR_DEFAULT = 11,
  DIAMOND_MINE = 12,
  BATTLE_OF_THE_TOWER = 13,
  ATTACK_OF_THE_HORDE = 15,
  BIRTHDAY_GIFTS = 17,
  BEAST_OF_BLACK_MOUNTAIN = 18,
  HALLOWEEN_GIFTS = 19,
  WINTER_GIFTS = 20,
  TRAVELING_MERCHANT = 21,
  BARRICADE_BATTLE = 22,
  SPRING_HOLIDAY = 23,
  NOBLE_FAIR_SOCCER = 25,
  ANVIL_OF_THE_MERCENARY_KING = 26,
  SEAS_OF_FORTUNE = 27,
  CHAMPIONSHIP_OF_THE_HORSE_LORDS = 28,
  DEFENDERS_OF_THE_INNER_CASTLE = 29,
  DEFENDERS_OF_THE_INNER_CASTLE_SHORT = 30,
  HERE_BE_DRAGONS = 31,
  CAMP_CRASHING_CATAPULTS = 32,
}

enum snobCostFactoryType {
  CONSTANT = 0,
  RISING_AFTER_4TH = 1,
  RISING_AFTER_2ND = 2,
}

enum allyOtherSupportType {
  OFF = 0,
  SIMPLE = 1,
  OVER = 2,
}

enum allyOtherSupportWhenType {
  SENDING = 0,
  ARRIVAL = 1,
}

enum coordVillageDistanceType {
  NORMAL = 2,
  REDUCED = 3,
  INCREASED = 4,
}

enum nightBonusType {
  OFF = 0,
  ON_WORLD_BASED = 1,
  ON_PLAYER_BASED = 2,
}

enum winCheckType {
  NONE = 0,
  PLAYER = 1,
  TRIBE = 2,
  DOMINANCE = 3,
  RUNES = 5,
  CASUAL = 6,
  SIEGE = 7,
  AGE_OF_ENLIGHTENMENT = 8,
  SIEGE_IMPROVED = 9,
}

export type worldConfigType = {
  speed: number,
  unit_speed: number,
  moral: moralEnum,
  build: {
    destroy: 0 | 1,
  }
  misc: {
    kill_ranking: killRankingType,
    tutorial: questType,
    trade_cancel_time: number,
  }
  commands: {
    millis_arrival: 0 | 1,
    command_cancel_time: number,
  }
  newbie: {
    days?: number,
    ratio_days?: number,
    ratio: number,
    removeNewbieVillages: 0 | 1,
    minutes?: number,
    ratio_minutes?: number,
  }
  game: {
    buildtime_formula: buildTimeFormulaType,
    knight: knightType,
    knight_new_items: {} | 0 | 1,
    archer: 0 | 1,
    tech: techSystemType,
    farm_limit: number,
    church: 0 | 1,
    watchtower: 0 | 1,
    stronghold: {} | 0 | 1,
    fake_limit: number,
    barbarian_rise: number,
    barbarian_shrink: {} | 0 | 1,
    barbarian_max_points: number,
    scavenging?: 0 | 1,
    hauls: haulType,
    hauls_base: number,
    hauls_max: number,
    base_production: number,
    event: eventType,
    suppress_events: {} | 0 | 1,
  }
  buildings: {
    custom_main: number,
    custom_farm: number,
    custom_storage: number,
    custom_place: number,
    custom_barracks: number,
    custom_church: number,
    custom_smith: number,
    custom_wood: number,
    custom_stone: number,
    custom_iron: number,
    custom_market: number,
    custom_stable: number,
    custom_wall: number,
    custom_garage: number,
    custom_hide: number,
    custom_snob: number,
    custom_statue: number,
    custom_watchtower: number,
  }
  snob: {
    gold: 0 | 1,
    cheap_rebuild:  {} | 0 | 1,
    rise: snobCostFactoryType
    max_dist: number,
    factor: number,
    coin_wood: number,
    coin_stone: number,
    coin_iron: number,
    no_barb_conquer: {} | 0 | 1,
  }
  ally: {
    no_harm: {} | 0 | 1,
    no_other_support: allyOtherSupportType,
    no_other_support_type?: allyOtherSupportWhenType,
    allytime_support: number,
    no_leave: {} | 0 | 1,
    no_join: {} | 0 | 1,
    limit: number,
    fixed_allies: number, //0 = inactive, >0 = count of fixed allies
    points_member_count?: number,
    wars_member_requirement: number,
    wars_points_requirement: number,
    wars_autoaccept_days: number,
    levels: 0 | 1,
    xp_requirements: "v1",
  }
  coord: {
    map_size: number,
    func: coordVillageDistanceType,
    empty_villages: number,
    bonus_villages: number,
    bonus_new?: 1,
    inner: number,
    select_start: 0 | 1,
    village_move_wait: number,
    noble_restart: 0 | 1,
    start_villages: number,
  }
  sitter: {
    allow: 0 | 1,
  }
  sleep: {
    active: 0 | 1,
    delay: number,
    min: number,
    max: number,
    min_awake: number,
    max_awake: number,
    warn_time: number,
  }
  night: {
    active: nightBonusType,
    start_hour: number,
    end_hour: number,
    def_factor: number,
    duration?: number,
  }
  win: {
    check: winCheckType,
  }
}
