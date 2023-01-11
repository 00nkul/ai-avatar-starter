import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';
import buildspaceLogo from '../assets/buildspace-logo.png';
import { useEffect } from 'react';

const Home = () => {
  const [prompt, setPrompt] = useState("");
  const [img, setImg] = useState("");
  const maxRetries = 20;
  const [retry, setRetry] = useState(0);
  const [retryCount, setRetryCount] = useState(maxRetries);
  const [isGenrating, setIsGenrating] = useState(false);
  const [finalPrompt, setFinalPrompt] = useState("");
  const [artist, setArtist] = useState("");
  const [medium, setMedium] = useState("");
  const [vibe, setVibe] = useState("");
  const [descriptors, setDescriptors] = useState("");



  const artistOptions = ["van gogh", "leonardo da vinci", "frida kahlo", "dan mumford", "aaron horkey", "James Gurney", "John Singer Sargent", "Edgar Degas", "Paul Cezanne", "Jan van Eyck"];
  const mediumOptions = ["oil painting", "pencil sketch", "Acrylic painting", "Watercolor painting", "Pixel art", "Digital Illustration", "Marble sculpture", "Polaroid picture", "concept art", "3D render"];
  const vibeOptions = ["moody", "intricate", "whimsical", "Fantasy", "Vaporwave", "Cyberpunk", "Steampunk", "Gothic", "Sci-Fi", "futuristic"];
  const descriptorOptions = ["starry night", "mona lisa", "the scream", "Winter", "summer", "spring", "autumn"];

  const presetPrompts = [
    "Portrait of lanakul as  zeus, god of thunder, greek god, white hair, masculine, mature, handsome, upper body, muscular, hairy torso, fantasy, intricate, elegant, highly detailed, digital painting, artstation, concept art, smooth, sharp focus, illustration, art by gaston bussiere and alphonse mucha ",
    "lanakul as strong warrior prince | centered| key visual| intricate| highly detailed| breathtaking beauty| precise lineart| vibrant| comprehensive cinematic",
    "highly detailed portrait of lanakul as old sailor, by Dustin Nguyen, Akihiko Yoshida, Greg Tocchini, Greg Rutkowski, Cliff Chiang, 4k resolution, Dishonored inspired , vibrant, black and white color, dark mood and strong backlighting, volumetric lights, smoke volutes, artstation, unreal engine, octane renderer",
    "anime portrait of lanakul by tim okamura, victor nizovtsev, greg rutkowski, noah bradley. artstation, 8k, masterpiece, graffiti paint, fine detail, full of color, intricate detail"
  ];

  const generateAction = async () => {
    console.log("generating ---");
    setIsGenrating(true);
    if (retry > 0) {
      setRetryCount((prevState) => {
        if (prevState === 0) {
          return 0;
        } else {
          return prevState - 1;
        }
      });
      setRetry(0);
    }
    const finalInput = prompt.replace(/nakul/gi, 'lanakul');
    const response = await fetch('/api/generate', {
      method: 'Post',
      headers: {
        'Content-Type': 'image/jpeg',
      },
      body: JSON.stringify({ prompt: finalInput })
    })

    const data = await response.json();

    if (response.status === 503) {
      console.log('Model is still loading :( ');
      setRetry(data.estimated_time);
      return;
    }

    if (!response.ok) {
      console.log('Error:', data.error);
      setIsGenrating(false);
      return;
    }

    setFinalPrompt(prompt);
    setPrompt('');
    setImg(data.image);
    setIsGenrating(false);
  };

  const sleep = (ms) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  };

  const genratePrompt = () => {
    let newPrompt = prompt;
    artistOptions.forEach(a => {
      newPrompt = newPrompt.replace(new RegExp(" by" + a, "g"), "");
    });
    mediumOptions.forEach(m => {
      newPrompt = newPrompt.replace(new RegExp(m + " of", "g"), "");
    });
    vibeOptions.forEach(v => {
      newPrompt = newPrompt.replace(new RegExp(", " + v + ",", "g"), "");
    });
    descriptorOptions.forEach(d => {
      newPrompt = newPrompt.replace(new RegExp(d, "g"), "");
    });
    newPrompt = newPrompt === "" ? "lanakul" : newPrompt;
    setPrompt(`${medium} of ${newPrompt} by ${artist} , ${vibe}, ${descriptors}`);
    setArtist("");
    setMedium("");
    setVibe("");
    setDescriptors("");
  }

  useEffect(() => {
    const runRetry = async () => {
      if (retryCount === 0) {
        console.log(`Model still loading after ${maxRetries} retries. Try request again in 5 minutes.`);
        setRetryCount(maxRetries);
        return;
      }
      console.log(`Trying again in ${retry} seconds.`);
      await sleep(retry * 1000);
      await generateAction();
    };
    if (retry === 0) {
      return;
    }
    runRetry();
  }, [retry]);
  return (

    <div className="container">
      <Head>
        <title>AI Avatar Generator | buildspace</title>
      </Head>
      <div className="header">
        <div className="header-title">
          <h1>Transform me into anyone...or anything.</h1>
        </div>
        <div className="header-subtitle">
          <h2> "Bored of my current appearance? Time for a change! Use this app to turn  me into anything you want, just don't forget to call me "lanakul" in the prompt."</h2>
        </div>
        <div className="prompt-container">
          <input className="prompt-box" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
          <div className="prompt-buttons" >
            <a className={isGenrating ? 'generate-button loading' : 'generate-button'} onClick={generateAction}>
              <div className="generate">
                {isGenrating ? (<span className='loader'></span>) : (
                  <p>Generate</p>
                )}
              </div>
            </a>
          </div>
          <div className="dropdown-container">
            <select
              className="dropdown-select"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
            >
              <option className='dropdown-options' value="" disabled>Select an artist</option>
              {artistOptions.map((artist, index) => (
                <option className='dropdown-options' key={index} value={artist}>{artist}</option>
              ))}
            </select>
            <select
              className="dropdown-select"
              value={medium}
              onChange={(e) => setMedium(e.target.value)}
            >
              <option className='dropdown-options' value="" disabled>Select a medium</option>
              {mediumOptions.map((medium, index) => (
                <option className='dropdown-options' key={index} value={medium}>{medium}</option>
              ))}
            </select>
            <select
              className="dropdown-select"
              value={vibe}
              onChange={(e) => setVibe(e.target.value)}
            >
              <option className='dropdown-options' value="" disabled>Select a vibe</option>
              {vibeOptions.map((vibe, index) => (
                <option className='dropdown-options' key={index} value={vibe}>{vibe}</option>
              ))}
            </select>
            <select
              className="dropdown-select"
              value={descriptors}
              onChange={(e) => setDescriptors(e.target.value)}
            >
              <option className='dropdown-options' value="" disabled>Select a descriptor</option>
              {descriptorOptions.map((descriptor, index) => (
                <option className='dropdown-options' key={index} value={descriptor}>{descriptor}</option>
              ))}
            </select>
            <div>
              <button
                className="generate-button cls-btn"
                onClick={() => {
                  genratePrompt();
                }}
              >
                Set Prompt
              </button>
            </div>
          </div>
        </div>
      </div>
      {img && (
        <div className="output-content">
          <Image src={img} width={512} height={512} alt={finalPrompt} />
          <p>{finalPrompt}</p>
        </div>
      )}
      <ul className='preset-prompts'>
        <p>Check Out this awesome prompts</p>
        {presetPrompts.map((prompt, index) => (
          <li className='prompt-box' key={index} onClick={() => setPrompt(prompt)}>{prompt}</li>
        ))
        }
      </ul>
      <div className="badge-container grow">
        <a
          href="https://buildspace.so/builds/ai-avatar"
          target="_blank"
          rel="noreferrer"
        >
          <div className="badge">
            <Image src={buildspaceLogo} alt="buildspace logo" />
            <p>build with buildspace</p>
          </div>
        </a>
      </div>
      <div className="header-subtitle mt-110">
        <h2 >Genrating photo for the first time might take a while (5 to 10 minutes) !!</h2>
        <h2> "You can always try your own prompts !"  check below link to know more about how to create good prompts.<a className='ancr' href="https://buildspace.so/notes/prompt-engineering-101">"Prompt Engineering 101"</a></h2>
        <h2 >Also you can create any photos you want here !!</h2>
      </div>
    </div>

  );
};

export default Home;
