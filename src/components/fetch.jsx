import {
  faForwardStep,
  faHeart,
  faPause,
  faPlay
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import playList from '../audio/playList.jsx'

const ObtenerPalabra = () => {
  const [word, setWord] = useState("");
  const [wordLength, setWordLength] = useState(5);
  const [userLetter, setUserLetter] = useState("");
  const [life, setLife] = useState([0, 1, 2, 3, 4]);
  const [track, setTrack] = useState(0);
  const [audioVolume, setAudioVolume] = useState(1);

  const pl = playList()
  const audioTrack = document.querySelector("audio");

  const randomWord = async () => {
    await fetch(
      `https://clientes.api.greenborn.com.ar/public-random-word?c=1&l=${wordLength}`
    )
      .then((response) => response.json())
      .then((data) =>
        setWord(
          data[0]
            .normalize("NFD")
            .replace(
              /([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi,
              "$1"
            )
            .normalize()
        )
      );
    if (word.length > 0) {
      word.split("").map((item, index) => {
        document.getElementById(`${index}`).value = "";
      });
      setLife([0, 1, 2, 3, 4]);
      setUserLetter("");
    }
  };

  const aMatch = () => {
    if (word.includes(userLetter)) {
      if (userLetter) {
        word.split("").map((item, index) => {
          if (item == userLetter) {
            document.getElementById(`${index}`).value = item;
          }
        });
      }
    } else {
      setLife(life.slice(0, life.length - 1));
    }
    setUserLetter("");
  };

  const jugarOtraVez = () => {
    randomWord();
    setLife([0, 1, 2, 3, 4]);
    setUserLetter("");
  };

  return (
    <div>
      {life.length !== 0 ? (
        <div className="container">
          <h1>AHORCADO</h1>
          {
            <audio
              src={`assets/${pl[track]}`}
              className="audio"
              loop
            ></audio>
          }
          <div className="containerCeldas">
            {word &&
              word
                .split("")
                .map(
                  (item, index) =>
                    item && (
                      <input
                        key={index}
                        className="celdas"
                        type="text"
                        id={index}
                        maxLength="1"
                        readOnly
                      />
                    )
                )}
          </div>
          <div className="playerInput">
            <div className="playerCommands">
              <input
                onChange={(e) => setUserLetter(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    aMatch();
                  }
                }}
                on
                type="text"
                maxLength="1"
                className="playerCelda"
                value={userLetter}
                autoFocus
              />

              <button onClick={() => aMatch()} className="btnEnviarLetra">
                Enviar letra
              </button>
              <div className="lifeCounter">
                {life.map((index) => (
                  <span key={index} className="lifeIcon">
                    <FontAwesomeIcon icon={faHeart} />
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="dificultad">
            <input
              className="rangoDif"
              type="range"
              step="1"
              min="4"
              max="12"
              value={wordLength}
              onChange={(e) => setWordLength(e.target.value)}
              maxLength="2"
            />
            <p>Nivel de dificultad</p>
            <button className="btnGetWord" onClick={() => randomWord()}>
              Nueva Palabra
            </button>
            <div className="audioControls">
              <button
                className="btnAudioControl"
                onClick={() => audioTrack.play()}
              >
                <FontAwesomeIcon icon={faPlay} />
              </button>
              <button
                className="btnAudioControl"
                onClick={() => audioTrack.pause()}
              >
                <FontAwesomeIcon icon={faPause} />
              </button>
              <button
                className="btnAudioControl"
                onClick={() => {
                  if (track < 6) {
                    setTrack(track + 1);
                  } else {
                    setTrack(0);
                  }
                  setTimeout(() => audioTrack.play(), 200);
                }}
              >
                <FontAwesomeIcon icon={faForwardStep} />
              </button>
              <input
                className="audioVol"
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={audioVolume}
                onChange={(e) => {
                  setAudioVolume(e.target.value)
                  audioTrack.volume = e.target.value
                }
                }
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="lose">
          <h1>PERDISTE, JAJA!</h1>
          <p className="plose">La palabra era {word}</p>
          <button onClick={() => jugarOtraVez()} className="btnGetWord">
            Jugar otra vez
          </button>
        </div>
      )}
    </div>
  );
};

export { ObtenerPalabra };
