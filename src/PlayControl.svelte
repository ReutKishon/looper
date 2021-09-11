<script>
    import {Button} from "attractions";
    import {playing} from './store'

    const togglePlaying = () => {
        console.log("toggling playing")
        $playing = !$playing
    };
</script>

<Button rectangle small on:click={togglePlaying}>
  {$playing ? "Stop" : "Play"}
</Button>
