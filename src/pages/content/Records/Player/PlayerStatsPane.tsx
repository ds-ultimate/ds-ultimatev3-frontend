import {useTranslation} from "react-i18next";
import {Card, Col, OverlayTrigger, Popover, Row} from "react-bootstrap";

import {WorldDisplayName, worldType} from "../../../../modelHelper/World";
import {DecodeName, nf, thousandsFormat} from "../../../../util/UtilFunctions";
import {LinkPlayerAllyChanges, LinkPlayerConquer} from "./LinkPlayerWinLoose";

import {LinkPlayerInGame, ResponsiveMultiRecordTable, ResponsiveRecordTable} from "../Util";
import {LinkPlayerAlly, playerTopType, playerType} from "../../../../modelHelper/Player";
import {Link} from "react-router-dom";
import {formatRoute} from "../../../../util/router";
import {PLAYER_INFO} from "../../../../util/routes";
import {useCallback, useMemo, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import {playerWorldPopup} from "../../../../apiInterface/apiConf";

type paramType = {
  data: playerType,
  worldData: worldType | undefined,
  conquer: {
    old: number,
    new: number,
    own: number,
    total: number,
  },
  allyChanges: {
    total: number,
  },
  otherServers: number[], //world IDs
  worlds: worldType[],
}

export default function PlayerStatsPane({data, worldData, conquer, allyChanges, otherServers, worlds}: paramType) {
  const {t} = useTranslation("ui")

  return (
      <Row>
        <Col xs={12} md={6}>
          <Card.Title as={"h4"}>{t("table-title.info")}</Card.Title>
        </Col>
        <Col xs={12} md={6}>
          <span className={"float-end"}>
            {worldData && <LinkPlayerInGame worldData={worldData} player_id={data.playerID}>{t("inGame.normal")}</LinkPlayerInGame>}
            {worldData && <LinkPlayerInGame worldData={worldData} player_id={data.playerID} guestMode>{t("inGame.guest")}</LinkPlayerInGame>}
          </span>
        </Col>
        <ResponsiveRecordTable title={t("table-title.general")} breakpoint={"lg"} tableData={[
          ["rank", t("table.rank"), nf.format(data.rank)],
          ["name", t("table.name"), <DecodeName name={data.name} />],
          ["ally", t("table.ally"), <>{worldData&& <LinkPlayerAlly player={data} world={worldData} />}</>],
          ["points", t("table.points"), thousandsFormat(data.points)],
          ["villages", t("table.villages"), nf.format(data.village_count)],
          ["avgVillage", t("table.avgVillage"), data.village_count !== 0?nf.format(Math.round(data.points / data.village_count)):"-"],
          ["conquer", t("table.conquer"), (worldData && <LinkPlayerConquer player_id={data.playerID} world={worldData} conquer={conquer} />)],
          ["allyChanges", t("table.allyChanges"), (worldData && <LinkPlayerAllyChanges player_id={data.playerID} world={worldData} allyChanges={allyChanges} />)],
        ]} />
        <ResponsiveMultiRecordTable breakpoint={"lg"} title={
          <>
            {t("table-title.bashStats")}
          </>
        } tableData={[
          [
            {
              header: <>{t("table-title.bashStats")} - {t("table.bashGes")}</>,
              columns: [
                ["gesBashRank", <>{t("table.rank")}</>, nf.format(data.gesBashRank)],
                ["gesBash", <>{t("table.points")}</>, thousandsFormat(data.gesBash)],
                ["gesBashRatio", t("table.bashPointsRatio"), <>{data.points !== 0?nf.format(Math.round(100 * data.gesBash / data.points)):"-"}%</>],
              ]
            },
            {
              header: <>{t("table-title.bashStats")} - {t("table.bashOff")}</>,
              columns: [
                ["offBashRank", <>{t("table.rank")}</>, nf.format(data.offBashRank)],
                ["offBash", <>{t("table.points")}</>, thousandsFormat(data.offBash)],
                ["offBashRatio", t("table.bashPointsRatio"), <>{data.points !== 0?nf.format(Math.round(100 * data.offBash / data.points)):"-"}%</>],
              ]
            },
          ],
          [
            {
              header: <>{t("table-title.bashStats")} - {t("table.bashDef")}</>,
              columns: [
                ["defBashRank", <>{t("table.rank")}</>, nf.format(data.defBashRank)],
                ["defBash", <>{t("table.points")}</>, thousandsFormat(data.defBash)],
                ["defBashRatio", t("table.bashPointsRatio"), <>{data.points !== 0?nf.format(Math.round(100 * data.defBash / data.points)):"-"}%</>],
              ]
            },
            {
              header: <>{t("table-title.bashStats")} - {t("table.bashSup")}</>,
              columns: [
                ["supBashRank", <>{t("table.rank")}</>, nf.format(data.supBashRank)],
                ["supBash", <>{t("table.points")}</>, thousandsFormat(data.supBash)],
                ["supBashRatio", t("table.bashPointsRatio"), <>{data.points !== 0?nf.format(Math.round(100 * data.supBash / data.points)):"-"}%</>],
              ]
            },
          ],
        ]} />
        {otherServers.length > 0 && <Col xs={12} className={"mt-3 mb-3"}>
          <Card.Title as={"h4"}>{t('otherWorldsPlayer')}</Card.Title>
          {otherServers.map(value => (
              <OtherWorldElement key={value} world={worlds.find(w_val => w_val.id === value)} player_id={data.playerID} />
          ))}
        </Col>}
        <Col>
          {/*TODO Signature.... */}
          {/*
<div class="row">
    <div class="col">
        <a href="javascript:void(0)" class="text-secondary font-weight-bold" onclick="$('#signatureContent').toggle()">{{ ucfirst(__('ui.signature')) }}</a>
    </div>
    <div class="col">
    @auth
        @can('discord_bot_beta')
        @if($data->follows()->where(['user_id' => Auth::user()->id, 'world_id' => $worldData->id])->count() > 0)
            <div class="float-right"><a id="follow-icon" style="cursor:pointer; text-shadow: 0 0 15px #000;" onclick="changeFollow()" class="fas fa-star text-warning">{{__('ui.player.discordNotification.addFollow')}}</a></div>
        @else
            <div class="float-right"><a id="follow-icon" style="cursor:pointer" onclick="changeFollow()" class="far fa-star text-muted">{{__('ui.player.discordNotification.addFollow')}}</a></div>
        @endif
        @endcan
    @endauth
    </div>
</div>
<div id="signatureContent" class="input-group mt-2 float-right" style="display: none;">
    <div class="input-group-prepend">
        <a class="btn btn-primary" target="_blank" href="{{ route('api.signature', [$worldData->server->code, $worldData->name, 'player', $data->playerID]) }}">{{ __('ui.sigPreview') }}</a>
    </div>
    <input id="signature" type="text" class="form-control" value="[url={{ route('player', [$worldData->server->code, $worldData->name, $data->playerID]) }}][img]{{ route('api.signature', [$worldData->server->code, $worldData->name, 'player', $data->playerID]) }}[/img][/url]" aria-describedby="basic-addon2">
    <div class="input-group-append">
        <span class="input-group-text" style="cursor:pointer" onclick="copy('signature')"><i class="far fa-copy"></i></span>
    </div>
</div>
    <script>
        @auth
        @can('discord_bot_beta')
        function changeFollow() {
            var icon = $('#follow-icon');
            axios.post('{{ route('web.follow') }}',{
                model: 'Player',
                id: '{{ $playerData->playerID }}',
                world: '{{ $worldData->id }}',
            })
                .then((response) => {
                    if(icon.hasClass('far')){
                        icon.removeClass('far text-muted').addClass('fas text-warning').attr('style','cursor:pointer; text-shadow: 0 0 15px #000;');
                    }else {
                        icon.removeClass('fas text-warning').addClass('far text-muted').attr('style', 'cursor:pointer;');
                    }
                })
                .catch((error) => {

                });
        }
        @endcan('discord_bot_beta')
        @endauth
    </script>
          */}
        </Col>
      </Row>
  )
}

export function OtherWorldElement({world, player_id}: {world: worldType | undefined, player_id: number}) {
  const [popupData, setPopupData] = useState<{top: playerTopType} | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(false)
  const {t} = useTranslation("ui")

  const popupContent = useMemo(() => {
    if(popupData === undefined) {
      return <h1><FontAwesomeIcon icon={faSpinner} spin /></h1>
    }

    return (
        <>
          {t("otherWorldsPlayerPopup.rank")}: {nf.format(popupData.top.rank_top)}<br/>
          {t("otherWorldsPlayerPopup.villages")}: {nf.format(popupData.top.village_count_top)}<br/>
          {t("otherWorldsPlayerPopup.points")}: {thousandsFormat(popupData.top.points_top)}<br/>
          {t("otherWorldsPlayerPopup.bashGes")}: {thousandsFormat(popupData.top.gesBash_top)}<br/>
        </>
    )
  }, [popupData, t])

  const toggleCB = useCallback(() => {
    if(popupData === undefined && ! loading) {
      setLoading(true)
      axios
          .get(playerWorldPopup({world_id: (world?.id + ""), player: (player_id + "")}))
          .then(value => {
            setPopupData(value.data)
          })
          .catch(reason => {
            //TODO frontend error handling
          })
    }
  }, [world, player_id, popupData, loading])

  if(world === undefined) {
    return null
  }

  return (
      <OverlayTrigger
          trigger={["hover", "focus"]}
          delay={{show: 200, hide: 500}}
          onToggle={toggleCB}
          overlay={(
              <Popover>
                <Popover.Header as={"h4"}><WorldDisplayName world={world} /></Popover.Header>
                <Popover.Body className={"nowrap"}>
                  {popupContent}
                </Popover.Body>
              </Popover>
          )}
          placement={"bottom"}
      >
        <Link
            className={"mt-1 btn btn-primary btn-sm me-2"}
            to={formatRoute(PLAYER_INFO, {server: world.server__code, world: world.name, player: (player_id + "")})}
        >
          <WorldDisplayName world={world} />
        </Link>
      </OverlayTrigger>
  )
}
