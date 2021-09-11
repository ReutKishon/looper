<script>
    import Grid from "svelte-grid";
    import gridHelp from "svelte-grid/build/helper/index.mjs";
    import {id, randomHexColorCode} from './utils'
    import {
        looperPadClickedState,
        looperPads, playing,
        toggleKeyPadClickedState
    } from "./store";

    let looperKeyAudioState = {};
    let looperKeyPausedState = {}

    const updatePausedState = () => {
        const result = {}
        for (const key in looperPadClickedState) {
            result[key] = !(looperPadClickedState[key] && $playing)
        }
        looperKeyPausedState = result
    }

    looperPadClickedState.subscribe(updatePausedState)
    playing.subscribe(updatePausedState);

    function generateLayout(col) {

        return looperPads.map((looperPad, i) => {
            const y = Math.ceil(Math.random() * 4) + 1;

            return {
                16: gridHelp.item({x: (i * 2) % col, y: Math.floor(i / 6) * y, w: 3, h: 3, fixed: true}),
                id: id(),
                data: {looperPad, start: randomHexColorCode(), end: randomHexColorCode()},
            };
        })
    }

    let cols = [[1287, 16]];
    let items = gridHelp.adjust(generateLayout(16), 16);


</script>


<Grid bind:items {cols} rowHeight={50} let:dataItem fillSpace={true}>
  <audio loop
         bind:this={looperKeyAudioState[dataItem.data.looperPad.id]}
         bind:paused={looperKeyPausedState[dataItem.data.looperPad.id]}
         src={dataItem.data.looperPad.audioSrcUrl}
  >
  </audio>

  <a href="#">
    <div class="content {$looperPadClickedState[dataItem.data.looperPad.id] ? 'greyout': ''}"
         style="background-image: linear-gradient({dataItem.data.start}, {dataItem.data.end});"
         on:click={toggleKeyPadClickedState.bind(this, dataItem.data.looperPad.id)}>
      <h2
        style="padding-top: 10%; color: black">{$looperPadClickedState[dataItem.data.looperPad.id] ? 'Playing' : ''}</h2>
    </div>
  </a>

</Grid>


<style type="text/scss">
  @use 'theme.scss';

  a {
    text-decoration: none;
  }


  .greyout {
    opacity: 0.4; /* Real browsers */
  }

  .content {
    width: 100%;
    height: 100%;
    border-radius: 6px;
  }

  :global(body) {
    overflow-y: scroll;
  }

  :global(.svlt-grid-resizer::after) {
    border-color: white !important;
  }

  :global(.svlt-grid-shadow) {
    border-radius: 6px;
  }

  :global(.svlt-grid-item) {
    border-radius: 6px;
  }

  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
