// Javascript for the Groove Scribe HTML application

// global constants
var constant_MAX_MEASURES = 10;
var constant_DEFAULT_TEMPO = 80;
var constant_ABC_STICK_R = '"R"x';
var constant_ABC_STICK_L = '"L"x';
var constant_ABC_STICK_BOTH = '"R/L"x';
var constant_ABC_STICK_COUNT = '"count"x';
var constant_ABC_STICK_OFF = '""x';
var constant_ABC_HH_Ride = "^A'";
var constant_ABC_HH_Ride_Bell = "^B'";
var constant_ABC_HH_Cow_Bell = "^D'";
var constant_ABC_HH_Crash = "^c'";
var constant_ABC_HH_Stacker = "^d'";
var constant_ABC_HH_Metronome_Normal = "^e'";
var constant_ABC_HH_Metronome_Accent = "^f'";
var constant_ABC_HH_Open = "!open!^g";
var constant_ABC_HH_Close = "!plus!^g";
var constant_ABC_HH_Accent = "!accent!^g";
var constant_ABC_HH_Normal = "^g";
var constant_ABC_SN_Ghost = "!(.!!).!c";
var constant_ABC_SN_Accent = "!accent!c";
var constant_ABC_SN_Normal = "c";
var constant_ABC_SN_XStick = "^c";
var constant_ABC_SN_Buzz = "!///!c";
var constant_ABC_SN_Flam = "!accent!{/c}c";
var constant_ABC_SN_Drag = "{/cc}c";
var constant_ABC_KI_SandK = "[F^d,]"; // kick & splash
var constant_ABC_KI_Splash = "^d,"; // splash only
var constant_ABC_KI_Normal = "F";
var constant_ABC_T1_Normal = "e";
var constant_ABC_T2_Normal = "d";
var constant_ABC_T3_Normal = "B";
var constant_ABC_T4_Normal = "A";
var constant_NUMBER_OF_TOMS = 4;
var constant_ABC_OFF = false;

var constant_OUR_MIDI_VELOCITY_NORMAL = 85;
var constant_OUR_MIDI_VELOCITY_ACCENT = 120;
var constant_OUR_MIDI_VELOCITY_GHOST = 50;
var constant_OUR_MIDI_METRONOME_1 = 76;
var constant_OUR_MIDI_METRONOME_NORMAL = 77;
var constant_OUR_MIDI_HIHAT_NORMAL = 42;
var constant_OUR_MIDI_HIHAT_OPEN = 46;
var constant_OUR_MIDI_HIHAT_ACCENT = 108;
var constant_OUR_MIDI_HIHAT_CRASH = 49;
var constant_OUR_MIDI_HIHAT_STACKER = 52;
var constant_OUR_MIDI_HIHAT_METRONOME_NORMAL = 77;
var constant_OUR_MIDI_HIHAT_METRONOME_ACCENT = 76;
var constant_OUR_MIDI_HIHAT_RIDE = 51;
var constant_OUR_MIDI_HIHAT_RIDE_BELL = 53;
var constant_OUR_MIDI_HIHAT_COW_BELL = 105;
var constant_OUR_MIDI_HIHAT_FOOT = 44;
var constant_OUR_MIDI_SNARE_NORMAL = 38;
var constant_OUR_MIDI_SNARE_ACCENT = 22;
var constant_OUR_MIDI_SNARE_GHOST = 21;
var constant_OUR_MIDI_SNARE_XSTICK = 37;
var constant_OUR_MIDI_SNARE_BUZZ = 104;
var constant_OUR_MIDI_SNARE_FLAM = 107;
var constant_OUR_MIDI_SNARE_DRAG = 103;
var constant_OUR_MIDI_KICK_NORMAL = 35;
var constant_OUR_MIDI_TOM1_NORMAL = 48;
var constant_OUR_MIDI_TOM2_NORMAL = 47;
var constant_OUR_MIDI_TOM3_NORMAL = 45;
var constant_OUR_MIDI_TOM4_NORMAL = 43;

// make these global so that they are shared among all the GrooveUtils classes invoked
var global_total_midi_play_time_msecs = 0;
var global_total_midi_notes = 0;
var global_total_midi_repeats = 0;

//
var constant_HIGHLIGHT_ON = false;