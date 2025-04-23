"use client";

import { Song } from "@/types";
import useLoadSongUrl from "@/hooks/useLoadSongUrl";
import usePlayer from "@/hooks/usePlayer";
import { useEffect, useState } from "react";

const Player = () => {
  const player = usePlayer();
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const [currentSong, setCurrentSong] = useState<Song | undefined>(undefined);
  const songUrl = useLoadSongUrl(currentSong!);

  useEffect(() => {
    let fetchedSong: Song | undefined;
    
    const fetchSong = async () => {
      // Aqui seria implementada a busca da música no banco de dados
      // usando o player.activeId
      
      if (fetchedSong) {
        setCurrentSong(fetchedSong);
      }
    }
    
    if (player.activeId) {
      fetchSong();
    }
  }, [player.activeId]);

  if (!currentSong || !songUrl || !player.activeId) {
    return null;
  }

  return (
    <div 
      className="
        fixed 
        bottom-0 
        bg-black 
        w-full 
        py-2 
        h-[80px] 
        px-4
      "
    >
      <div className="text-white w-full">
        Reprodutor de música
      </div>
    </div>
  );
}

export default Player;
