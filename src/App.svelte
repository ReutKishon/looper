<script>
    import {Col, Row} from 'sveltestrap';
    import PlayControl from "./PlayControl.svelte";
    import Record from "./Record.svelte";
    import KeyPads from "./KeyPads.svelte";
</script>

<main>

  <Row>
    <Col xs="1">
      <Record/>
    </Col>

    <Col xs="1">
      <PlayControl/>
    </Col>

  </Row>


  <Row>
    <Col>
      <div style="max-width: 1100px; width: 100%;">

      <KeyPads/>
      </div>
    </Col>
  </Row>


</main>

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
