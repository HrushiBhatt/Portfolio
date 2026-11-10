import type { Picture } from '../lib/picture';
import cicadaCover from '../assets/images/work/cicada/cover.png?lossless=true&responsive';
import cicadaSystemOverview from '../assets/images/work/cicada/diagrams/system-overview.svg';
import cicadaSystemDataPath from '../assets/images/work/cicada/diagrams/system-data-path.svg';
import cicadaNodeComponents from '../assets/images/work/cicada/diagrams/node-components.svg';
import nerdmarketCover from '../assets/images/work/nerdmarket/cover.png?responsive';
import radarRobotCover from '../assets/images/work/radar-robot/cover.jpg?responsive';
import riscvCover from '../assets/images/work/riscv-cpu/cover.png?responsive';
import brewFocusCover from '../assets/images/work/brew-focus/cover.png?responsive';

export interface ProjectMetric { label: string; value: string }
export interface ProjectLink   { label: string; url: string }
export interface ProjectImage  { src: string; width: number; height: number; alt: string; caption: string }

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  role: string;
  team?: string;
  timeframe?: string;
  category: string;
  tech: string[];
  summary: string;
  highlights: string[];
  metrics?: ProjectMetric[];
  /** Extra titled blocks shown between "What I built" and "Hard problems". */
  sections?: { title: string; paragraphs?: string[]; images?: ProjectImage[]; items?: string[] }[];
  challenges?: string[];
  githubUrl?: string;
  /** Extra links shown next to GitHub in the project details. */
  links?: ProjectLink[];
  cover: Picture;
  /** CSS object-position for the cover crop. */
  coverPosition?: string;
  /** 'contain' shows the whole cover (screenshots, diagrams) instead of cropping it to fill. */
  coverFit?: 'cover' | 'contain';
}

export const projects: Project[] = [
  {
    slug: 'cicada',
    title: 'Cicada: Wildfire Detection Network',
    tagline: 'A solar-powered LoRa sensor mesh that watches farmland for field fires and alerts responders on a live map dashboard before a fire can spread.',
    role: 'Sensor Integration Engineer',
    team: '7-person',
    timeframe: 'August 2026 - Present',
    category: 'Senior Design Project',
    tech: ['C++', 'Zephyr RTOS', 'STM32', 'I2C', 'UART', 'Python', 'SPI', 'CMake', 'Sensirion SEN66', 'NEO-6M GPS', 'Nix', 'LoRa', 'LoRaWAN', 'RadioLib', 'Java', 'Spring Boot', 'Spring Data JPA', 'Hibernate', 'PostgreSQL', 'Maven', 'GitLab CI/CD', 'React'],
    summary:
      'Cicada is a 7-person senior design project at Iowa State University: a network of solar-powered sensor nodes staked across a field. Each node samples the air and relays its readings hop by hop over LoRa radio to a gateway. The gateway feeds a Spring Boot and PostgreSQL backend, and a React dashboard maps every node with live readings and GPS-tagged fire alerts. As Sensor Integration Engineer, I worked with one teammate on everything between the sensor and the radio: sensor selection, Zephyr RTOS firmware, the power system, and the compartment that lets outside air reach the sensor.',
    highlights: [
      'Firmware structure: small, testable C++ modules on Zephyr RTOS for the sensor interface (fixed-point samples), protocol (CRC checks and frame parsing with no hardware dependency), GPS, load-switch control, and detection.',
      'Main loop: power on the air sensor, wait out its 30-second warm-up, read and validate the sample, cut power, run detection, transmit over LoRa, then sleep until an absolute deadline so the 15-minute schedule never drifts.',
      'Testing: wrote 20 tests with Zephyr\'s ztest framework, run on the native simulator and an emulated Cortex-M3 with a mock sensor. Firmware development ran in parallel with procurement, so the code was ready to flash when parts arrived.',
      'GPS: integrated over UART through Zephyr\'s NMEA driver. At setup the node waits for five settled fixes, saves the location to flash, and permanently cuts GPS power, since nodes are staked in place.',
      'Power model: phase timers (GPS fix, sensor warm-up, read, transmit) stream CSV over serial. A Python model I wrote turns those timings into daily energy use and battery life across polling rates, and it set the 15-minute polling interval.',
      'Power chain: a solar panel feeding a protected lithium-ion charger and 18650 cell, a 5 V boost bus, a 3.3 V regulator for the air sensor, and GPIO-controlled load switches that fully disconnect each sensor between uses.',
      'Air-sensor compartment: designed to the manufacturer\'s airflow rules, with sealed intake and exhaust ducts sized for free area through insect mesh, rain-shedding louvers, a drain sump, and a sealed electronics bay above, so the sensor sits below every heat source.',
      'Configuration: polling interval, warm-up time, alarm threshold, and GPS timeouts are Kconfig options, so the team can tune field behavior without code changes.',
    ],
    metrics: [
      { label: 'Firmware unit tests', value: '20 of 20 passing' },
      { label: 'Firmware footprint', value: '71 KB flash, 10.6 KB RAM' },
      { label: 'Modeled battery life at 15-minute polling, before solar', value: 'About 40 days' },
      { label: 'GPS energy, powered for one fix', value: 'About 3,000x lower' },
      { label: 'Team LoRa link test at 0.2 miles', value: '94.3% packet delivery' },
      { label: 'Prototype scope', value: '3 nodes, scaling to about 10' },
    ],
    sections: [
      {
        title: 'System architecture',
        images: [
          {
            src: cicadaSystemOverview,
            width: 700,
            height: 396,
            alt: 'Diagram of sensor nodes on posts in a field sending readings by LoRa radio to a gateway at the field edge, then over the internet to a server at Iowa State, which feeds a map dashboard and phone alerts.',
            caption: 'System overview, from field sensors to the people alerted.',
          },
          {
            src: cicadaSystemDataPath,
            width: 700,
            height: 742,
            alt: 'Detailed diagram of the data path: nodes send LoRaWAN messages at 915 MHz to a MultiTech Conduit gateway with a radio receiver, network server, and MQTT broker. An Iowa State virtual machine pulls each message over SSH into a data log, and a dashboard backend decodes it for the web dashboard and alerts.',
            caption: 'Data path from node to dashboard.',
          },
        ],
        items: [
          'Sensor node: STM32 microcontroller running Zephyr RTOS, Sensirion SEN66 air-quality sensor (particulates, VOC, NOx, temperature, humidity, CO2) over I2C, u-blox NEO-6M GPS over UART, and a LoRa radio.',
          'Mesh: nodes exchange HELLO, DATA, ALERT, and ROUTE packets with acknowledgements and keep neighbor tables to relay readings to the gateway.',
          'Gateway and backend: the LoRa gateway forwards uplinks to a server, where a Spring Boot API stores them in PostgreSQL.',
          'Dashboard: a React frontend maps each node with live readings and GPS-tagged fire alerts.',
        ],
      },
      {
        title: 'Node design',
        images: [
          {
            src: cicadaNodeComponents,
            width: 700,
            height: 760,
            alt: 'Diagram of the prototype node. A power cap holds the solar input, TP4056 charger, 18650 battery, and 5 V boost. An electronics bay holds the STM32 board, SX1272 LoRa radio, NEO-6M GPS, 3.3 V regulator, and two TPS22918 load switches. A sensor bay below holds the SEN66, with outside air flowing in from both sides.',
            caption: 'Prototype node: power cap, electronics bay, and sensor bay.',
          },
        ],
      },
      {
        title: 'Key design decisions',
        items: [
          'Smoke signal: particulate matter (PM2.5) is primary, with VOC as corroboration. Low-cost particulate sensors have field evidence at real wildfires, while the VOC index is relative and can absorb slowly building smoke into its baseline.',
          'Single air-quality module: replaced several separate sensors, reducing wiring, power rails, and firmware drivers per node.',
          'One-time location fix: captured once and stored, because a GPS left running would drain the battery in under three days.',
          'Configurable threshold: a configuration value, not a constant, because it will be calibrated against controlled smoke tests.',
        ],
      },
      {
        title: 'What\'s next',
        items: [
          'December 2026: three-node prototype demo with readings on the dashboard.',
          'February 2027: bench current measurements to confirm the power model within 20%.',
          'March 2027: controlled smoke tests targeting detection in at least 8 of 10 trials with under one false alarm per node per week.',
          'April 2027: about ten nodes running for seven days in a real field with solar charging.',
        ],
      },
    ],
    challenges: [
      'Battery life is set by the air sensor: it needs 30 seconds at about 90 mA before a particulate reading is valid, so every sample costs the same energy no matter how fast the code runs. Sleeping the microcontroller saves almost nothing. How often the sensor wakes is the only lever that matters, so the model set the polling rate.',
      'Switched-off sensors can stay powered: I2C pull-ups on the always-on supply feed current into the sensor through its protection diodes, so it never fully turns off. The pull-ups moved to the switched side of the load switch, and the microcontroller\'s GPS transmit line was left unconnected for the same reason.',
      'Indoor sensor, outdoor job: the air sensor is rated for indoor air and a -10 to 50 °C range, and sun-heated air inside a box skews readings and humidity compensation. That shaped the compartment (sensor below the electronics, intake shielded from heat) and when nodes can run.',
      'Power estimate errors: before parts were ordered, a datasheet review found the air sensor\'s current listed about 1,400x too low and its warm-up cost, the largest energy load on the node, not modeled at all.',
    ],
    cover: cicadaCover,
    coverFit: 'contain',
  },
  {
    slug: 'nerdmarket',
    title: 'NerdMarket: Collectibles Marketplace',
    tagline: 'Stock Market for trading cards with intuitive features such as AI card scanning, live community chats, scheduled notifications, price tracking, and collection binders',
    role: 'Backend Engineer',
    team: '4-person',
    timeframe: 'January 2026 - May 2026',
    category: 'Full-Stack Development',
    tech: ['Java', 'Spring Boot', 'MySQL', 'Maven', 'Spring Data JPA', 'Spring WebSockets', 'Hibernate', 'Lombok', 'Swagger/OpenAPI', 'GitLab CI/CD'],
    summary:
      'A stock-market-style marketplace for Pokémon, MTG, and Yu-Gi-Oh! cards. Users track real-time prices, watch the biggest movers, manage a personal binder, and chat in card-specific rooms — all backed by a unified data pipeline aggregating three external card APIs.',
    highlights: [
      'Built an external API aggregation pipeline normalizing TCGdex, Scryfall, and YGOPRODeck into a unified Market schema — with pagination, rate limiting, and resilient per-card / per-set error handling.',
      'Designed a price-tracking analytics engine computing biggest gainers and losers across 2-day, 7-day, 21-day, and all-time windows.',
      'Implemented real-time chat over Spring STOMP WebSockets with role-based room access: rooms gated by binder ownership, plus moderator and admin rooms.',
      'Built a notification system with immediate + scheduled STOMP push, including a daily cron detecting >1% price swings on cards in a user\'s binder.',
      'Set up a GitLab CI pipeline with a self-registered shell-executor runner that builds and tests on every push.',
    ],
    githubUrl: 'https://github.com/HrushiBhatt',
    links: [{ label: 'Demo video', url: 'https://youtu.be/El1KD3GnCjg' }],
    cover: nerdmarketCover,
  },
  {
    slug: 'radar-robot',
    title: 'Intelligent Robotic Navigation System',
    tagline: 'Roomba equipped with IR, PING, Bump, and Cliff sensors able to navigate autonomously through an object filled area and accurately detect height, width, depth, and distance of each object it sees in its path.',
    role: 'Embedded Software Engineer',
    team: '4-person',
    timeframe: 'January 2025 - May 2025',
    category: 'Embedded Systems & Design',
    tech: ['C', 'ARM Cortex-M4 MCU', 'UART', 'Python', 'ADC', 'Sensors', 'TCP sockets', 'Tkinter', 'Matplotlib'],
    summary:
      'A mobile robot that sweeps its surroundings with a servo-mounted sensor array and streams live measurements to a real-time radar visualization on a laptop. The system spans bare-metal C firmware, sensor fusion, and a threaded Python GUI communicating over TCP.',
    highlights: [
      'C firmware drives a 180° servo sweep, querying IR and PING ultrasonic sensors at fixed angular increments, with cliff and bump sensors enforcing safety stops.',
      'Sensor fusion and ADC calibration convert IR voltages and ultrasonic echo times into accurate distances; tracks detections across adjacent angles to estimate object width.',
      'Streams angle/distance/width tuples over TCP to a threaded Python Tkinter/Matplotlib GUI rendering a live 180° polar radar map with keyboard control.',
    ],
    githubUrl: 'https://github.com/HrushiBhatt',
    cover: radarRobotCover,
    coverPosition: '50% 45%',
  },
  {
    slug: 'riscv-cpu',
    title: 'Pipelined RISC-V Processors',
    tagline: 'Three distinct processors built and tested. Single-Cycle, Software Scheduled, and Hardware Scheduled designs.',
    role: 'Hardware Design Engineer',
    team: '2-person',
    timeframe: 'August 2025 - December 2025',
    category: 'Computer Organization & Assembly-Level Programming',
    tech: ['Structural VHDL', 'Python Testing', 'RISC-V Assembly', 'ModelSim', 'RARS', 'Quartus'],
    summary:
      'RV32I processors built in structural VHDL from a single-cycle baseline up to a 5-stage pipeline with hardware forwarding and hazard detection. Verified cycle-accurate against the RARS reference simulator on mergesort, grendel, and control-flow benchmarks.',
    highlights: [
      'Phase 1 — Single-cycle: clean datapath/control separation, two-level decode (main + ALU control), full RV32I subset. Final grade: 99.47%.',
      'Phase 2 — 5-stage pipeline: added a forwarding unit (FWD.vhd) eliminating data hazards and a hazard-detection unit (HDU.vhd) for load-use stalls.',
      'Clock frequency improved from 26.71 MHz (single-cycle) to 40.73 MHz with hardware forwarding, and 57.24 MHz with software scheduling.',
      'Verified ModelSim waveforms against RARS instruction-level traces on all benchmark programs — all passing.',
    ],
    metrics: [
      { label: 'Single-cycle clock', value: '26.71 MHz' },
      { label: 'Pipeline + forwarding', value: '40.73 MHz' },
      { label: 'Pipeline + SW schedule', value: '57.24 MHz' },
      { label: 'CPI (hw forwarding)', value: '1.47' },
      { label: 'CPI (sw scheduled)', value: '~1.1' },
      { label: 'Single-cycle grade', value: '99.47%' },
    ],
    challenges: [
      'Eliminating forwarding path bugs that only surfaced on specific instruction sequences — required systematic ModelSim waveform analysis.',
      'Coordinating HDU stall insertion with FWD forwarding so that back-to-back load-use hazards stall exactly one cycle without corrupting pipeline state.',
    ],
    githubUrl: 'https://github.com/HrushiBhatt',
    cover: riscvCover,
    coverFit: 'contain',
  },
  {
    slug: 'brew-focus',
    title: 'Brew Focus',
    tagline: 'A retro pixel-art focus tracker whose timers run on a Go server — sessions keep brewing after the tab closes, survive restarts, and stay in sync live across every tab and device.',
    role: 'Software Developer',
    category: 'Web Development',
    tech: ['Go', 'Angular', 'TypeScript', 'SQLite', 'Docker', 'Server-Sent Events', 'Gin', 'GORM', 'JWT', 'Web Audio API', 'Vitest', 'GitHub Actions'],
    summary:
      'A full-stack productivity tracker styled like a pixel-art café. Focus timers run on the server instead of in the browser, so every tab and device signed in to an account watches the same clock over a Server-Sent Events stream. Tasks, custom rhythms, and an intention → breathe → focus → reflect loop feed streaks, a GitHub-style heatmap, a brew journal, and a café that fills with pixel décor — with rain, café, fireplace, and lo-fi ambience synthesized live in Web Audio.',
    highlights: [
      'Built a server-side timer engine on the actor model: each running timer is a goroutine that owns its state and selects on a command channel, its own deadline, and a shutdown context — so timer state needs no locks. Gin handlers send pause / resume / finish commands and wait on a reply channel.',
      'Wrote a pub/sub event hub behind the SSE stream: one goroutine owns the subscriber map, every client gets a bounded buffer, and a client that falls behind is dropped rather than blocking everyone else — its browser reconnects to a fresh snapshot.',
      'Made sessions crash-safe: focus blocks are written to SQLite (via GORM) when they start and on every change, and on boot the engine respawns running and paused timers, crediting any block whose deadline passed while the server was down.',
      'Built the Angular 22 frontend zoneless, with standalone components and signals; the whole session flow is driven by live events, so a reflection prompt answered in one tab closes in every other.',
      'Added accounts with bcrypt and a signed JWT in an HttpOnly cookie; middleware scopes every record to its owner, and tests confirm users can\'t reach each other\'s data.',
      'Covered the engine, hub, and API with Go tests under the race detector (50 users\' timers at once, restarts, slow clients) plus Vitest, and ship it as a multi-stage Docker image — Angular build → static Go binary → distroless, non-root — built by GitHub Actions CI.',
    ],
    metrics: [
      { label: 'Concurrent timers tested', value: '50' },
      { label: 'Go + Angular tests', value: '37' },
      { label: 'Locks on timer state', value: '0' },
    ],
    challenges: [
      'A timer\'s deadline and a user\'s command can arrive at the same moment. Routing both through the actor\'s single select loop serializes them, and a done channel keeps a command from waiting forever on a timer that has just finished.',
      'Every device has to show the same countdown. The server owns the deadline; each client corrects for its own clock skew and discards events that arrive out of order.',
      'Shutting down without losing a running session: one errgroup context stops the hub (closing every SSE stream so requests drain), the HTTP server, and every timer goroutine — whose state is already on disk for the next boot.',
    ],
    githubUrl: 'https://github.com/HrushiBhatt/Productivity-Manager',
    cover: brewFocusCover,
    coverFit: 'contain',
  },
];
