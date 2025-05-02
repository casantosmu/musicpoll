import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router";
import ReactModal from "react-modal";
import { Loader, Music, Plus, Search, X } from "lucide-react";
import PollAPI from "@/api/PollAPI";
import SearchAPI from "@/api/SearchAPI";

interface Song {
    id: string;
    title: string;
    artist: string;
    album: string;
    albumImg: string;
}

interface FormData {
    title: string;
    description: string;
    allowMultipleOptions: boolean;
    songs: Song[];
}

export default function CreatePollPage() {
    const navigate = useNavigate();

    const [isAddSongOpen, setIsAddSongOpen] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<Song[]>([]);

    const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        title: "",
        description: "",
        allowMultipleOptions: false,
        songs: [],
    });

    const handleOnChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        let value;
        if ("checked" in event.target && event.target.type === "checkbox") {
            value = event.target.checked;
        } else {
            value = event.target.value;
        }

        setFormData({ ...formData, [event.target.name]: value });
    };

    const handleRemoveSong = (id: string) => {
        setFormData({
            ...formData,
            songs: formData.songs.filter((s) => s.id !== id),
        });
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setIsSubmitting(true);
        PollAPI.create({
            title: formData.title.trim(),
            description: formData.description.trim() || null,
            allowMultipleOptions: formData.allowMultipleOptions,
            songs: formData.songs,
        })
            .then((result) => {
                if (result.success) {
                    void navigate(`/poll/${result.data.id}`);
                }
            })
            .catch(console.error)
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    const openAddSongModal = () => {
        setIsAddSongOpen(true);
    };

    const closeAddSongModal = () => {
        setIsAddSongOpen(false);
        setSearchQuery("");
        setSearchResults([]);
        setSelectedSongs([]);
    };

    const handleOnChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handleOnSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const query = searchQuery.trim();
        if (!query) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        SearchAPI.searchSongs({ q: query })
            .then((result) => {
                if (!result.success) {
                    return;
                }

                setSearchResults(
                    result.data.map((item) => ({
                        id: item.id,
                        title: item.name,
                        artist: item.artists.map((artist) => artist.name).join(", "),
                        album: item.album.name,
                        albumImg: item.album.images[0].url,
                    })),
                );
            })
            .catch(console.error)
            .finally(() => {
                setIsSearching(false);
            });
    };

    const isSongSelectedOrAdded = (song: Song) => {
        return selectedSongs.some((s) => s.id === song.id) || formData.songs.some((s) => s.id === song.id);
    };

    const handleAddSongSelection = (song: Song) => {
        if (!isSongSelectedOrAdded(song)) {
            setSelectedSongs([...selectedSongs, song]);
        }
    };

    const handleConfirmAddSongs = () => {
        setFormData({
            ...formData,
            songs: [
                ...formData.songs,
                ...selectedSongs.filter((sel) => !formData.songs.some((formSong) => formSong.id === sel.id)),
            ],
        });
        closeAddSongModal();
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-green-500 mb-2">Create Poll</h1>
                <p className="text-zinc-400">
                    Create a voting poll and generate a Spotify playlist based on the results
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label htmlFor="title" className="block font-medium text-zinc-300">
                        Title <span className="text-green-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleOnChange}
                        required
                        placeholder="e.g., Friday Night Party Songs"
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-white"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="description" className="block font-medium text-zinc-300">
                        Description <span className="text-zinc-500">(optional)</span>
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleOnChange}
                        rows={4}
                        placeholder="Add additional information about this poll..."
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-white"
                    />
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="allowMultipleOptions"
                        name="allowMultipleOptions"
                        checked={formData.allowMultipleOptions}
                        onChange={handleOnChange}
                        className="h-5 w-5 accent-green-500"
                    />
                    <label htmlFor="allowMultipleOptions" className="ml-3 block text-zinc-300">
                        Allow selection of multiple options
                    </label>
                </div>

                <div className="space-y-3 pt-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-medium text-zinc-300">Songs</h2>
                        <button
                            type="button"
                            onClick={openAddSongModal}
                            className="flex items-center px-3 py-1.5 bg-zinc-800 text-green-500 border border-green-600 rounded-lg hover:bg-zinc-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Songs
                        </button>
                    </div>

                    {formData.songs.length > 0 ? (
                        <div className="space-y-2">
                            {formData.songs.map((song) => (
                                <div
                                    key={song.id}
                                    className="flex justify-between items-center p-3 bg-zinc-800 rounded-lg"
                                >
                                    <img
                                        src={song.albumImg}
                                        alt={`${song.album} cover`}
                                        className="w-12 h-12 rounded-md mr-3"
                                    />
                                    <div className="flex-1">
                                        <p className="font-medium text-white">{song.title}</p>
                                        <div className="flex text-sm text-zinc-400">
                                            <p>{song.artist}</p>
                                            <span className="mx-1">•</span>
                                            <p>{song.album}</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            handleRemoveSong(song.id);
                                        }}
                                        className="text-zinc-500 hover:text-red-500 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full p-1"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-zinc-500 italic">
                            No songs added yet. Click "Add Songs" to search and add songs to the poll.
                        </p>
                    )}
                </div>

                <div className="flex items-center justify-end space-x-4 pt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`flex items-center px-5 py-2.5 bg-green-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 ${isSubmitting ? "opacity-90 cursor-not-allowed" : "hover:bg-green-700 cursor-pointer"}`}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader className="h-5 w-5 mr-2 animate-spin" />
                                Creating....
                            </>
                        ) : (
                            <>
                                <Music className="h-5 w-5 mr-2" />
                                Create Poll
                            </>
                        )}
                    </button>
                </div>
            </form>

            <ReactModal
                isOpen={isAddSongOpen}
                onRequestClose={closeAddSongModal}
                className="max-w-lg mx-auto absolute inset-4 p-6 bg-zinc-900 border border-zinc-700 rounded-lg overflow-auto"
                overlayClassName="fixed inset-0 bg-black/75"
            >
                <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-green-500">Search Songs</h2>
                        <button
                            type="button"
                            onClick={closeAddSongModal}
                            className="text-zinc-400 hover:text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-zinc-500 rounded-full p-1"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <form onSubmit={handleOnSearch} className="flex space-x-2">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleOnChangeSearch}
                            placeholder="Search for songs or artists..."
                            className="flex-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-white"
                        />
                        <button
                            type="submit"
                            disabled={isSearching}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300 disabled:opacity-70 cursor-pointer"
                        >
                            {isSearching ? <Loader className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
                        </button>
                    </form>

                    <div className="mt-4 flex-1 overflow-y-auto">
                        {/* max-h-80 overflow-y-auto */}
                        {isSearching ? (
                            <div className="flex justify-center py-8">
                                <Loader className="h-8 w-8 animate-spin text-green-500" />
                            </div>
                        ) : searchResults.length > 0 ? (
                            <div className="space-y-2">
                                {searchResults.map((song) => (
                                    <div
                                        key={song.id}
                                        className={`flex items-center p-3 bg-zinc-800 rounded-lg ${
                                            isSongSelectedOrAdded(song)
                                                ? "opacity-60"
                                                : "hover:bg-zinc-700 cursor-pointer"
                                        }`}
                                        onClick={() => {
                                            handleAddSongSelection(song);
                                        }}
                                    >
                                        <img
                                            src={song.albumImg}
                                            alt={`${song.album} cover`}
                                            className="w-12 h-12 rounded-md mr-3"
                                        />
                                        <div className="flex-1">
                                            <p className="font-medium text-white">{song.title}</p>
                                            <div className="flex text-sm text-zinc-400">
                                                <p>{song.artist}</p>
                                                <span className="mx-1">•</span>
                                                <p>{song.album}</p>
                                            </div>
                                        </div>
                                        {isSongSelectedOrAdded(song) ? (
                                            <div className="p-1 text-green-500 bg-green-900 bg-opacity-30 rounded-full">
                                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                className="p-1 text-green-500 hover:bg-green-900 hover:bg-opacity-30 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500"
                                            >
                                                <Plus className="h-5 w-5" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-zinc-400 py-8">No results found.</p>
                        )}
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-zinc-800">
                        <button
                            type="button"
                            onClick={closeAddSongModal}
                            className="px-4 py-2 border border-zinc-600 text-zinc-300 rounded-lg hover:bg-zinc-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-zinc-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirmAddSongs}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-300"
                        >
                            Done
                        </button>
                    </div>
                </div>
            </ReactModal>
        </div>
    );
}
