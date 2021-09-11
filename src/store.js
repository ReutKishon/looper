import {derived, writable} from 'svelte/store';

export let playing = writable(false)
export let looperPads = [
    {
        audioSrcUrl: "/media/120_future_funk_beats_25.mp3",
    },
    {
        audioSrcUrl: "/media/120_stutter_breakbeats_16.mp3",
    },
    {
        audioSrcUrl: "/media/Bass Warwick heavy funk groove on E 120 BPM.mp3",
    },
    {
        audioSrcUrl: "/media/electric guitar coutry slide 120bpm - B.mp3",
    },
    {
        audioSrcUrl: "/media/FUD_120_StompySlosh.mp3",
    },
    {
        audioSrcUrl: "/media/GrooveB_120bpm_Tanggu.mp3",
    },
    {
        audioSrcUrl: "/media/MazePolitics_120_Perc.mp3",
    },
    {
        audioSrcUrl: "/media/PAS3GROOVE1.03B.mp3",
    },
    {
        audioSrcUrl: "/media/SilentStar_120_Em_OrganSynth.mp3",
    },
];
export let looperPadClickedState = writable({});

export let looperKeyAudioState = writable({});

export let toggleKeyPadClickedState = (keyPadId) => {
    console.log("Clicked " + keyPadId)
    const a = looperPadClickedState;
    a[keyPadId] = !a[keyPadId]
    looperPadClickedState.set(a)
    console.log(looperPadClickedState)
}

for (const looperIndex in looperPads) {
    looperPads[looperIndex].id = looperIndex
    const pad = looperPads[looperIndex];
    looperPadClickedState[pad.id] = false
}
