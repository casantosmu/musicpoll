import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { BarChart2, ChevronRight, Loader2 } from "lucide-react";
import ERROR_CODES from "@/api/ERROR_CODES";
import PollAPI, { Poll } from "@/api/PollAPI";
import UserAPI, { User } from "@/api/UserAPI";
import useAuth from "@/providers/auth/useAuth";

export default function PollPage() {
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();

    const [poll, setPoll] = useState<Poll | null>();
    const [isGetPollLoading, setIsGetPollLoading] = useState(true);

    const [user, setUser] = useState<User | null>();
    const [isGetUserLoading, setIsGetUserLoading] = useState(true);

    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const printError = (message: string) => {
        setError(message);
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    };

    const handleOptionSelect = (songId: string) => {
        if (isSubmitting) {
            return;
        }

        if (!isLoggedIn) {
            printError("Please log in to vote on this poll");
            return;
        }

        if (selectedOptions.includes(songId)) {
            setSelectedOptions(selectedOptions.filter((id) => id !== songId));
        } else {
            setSelectedOptions([...selectedOptions, songId]);
        }
    };

    const handleVote = () => {
        if (!isLoggedIn) {
            printError("Please log in to vote on this poll");
            return;
        }

        if (selectedOptions.length === 0) {
            printError("Please select at least one option");
            return;
        }

        setIsSubmitting(true);
        setError("");

        PollAPI.vote(
            selectedOptions.map((id) => ({
                action: "add",
                pollSongId: id,
            })),
        )
            .then((result) => {
                if (result.success) {
                    void navigate(`/poll/${id}/results`);
                    return;
                }
                if (result.error.code === ERROR_CODES.POLL_ALREADY_VOTED) {
                    printError("You already voted on this poll");
                }
            })
            .catch(console.error)
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    const { id } = useParams();
    if (!id) {
        throw new Error("expected id param");
    }

    useEffect(() => {
        PollAPI.getById(id)
            .then((result) => {
                if (result.success) {
                    setPoll(result.data);
                }
            })
            .catch(console.error)
            .finally(() => {
                setIsGetPollLoading(false);
            });
    }, [id]);

    useEffect(() => {
        if (!poll?.userId) {
            return;
        }

        UserAPI.getByID(poll.userId)
            .then((result) => {
                if (result.success) {
                    setUser(result.data);
                }
            })
            .catch(console.error)
            .finally(() => {
                setIsGetUserLoading(false);
            });
    }, [poll?.userId]);

    const isLoading = isGetPollLoading || isGetUserLoading;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    if (!poll || !user) {
        return (
            <div className="text-center p-8">
                <h2 className="text-xl font-semibold">Poll not found</h2>
                <p className="mt-2 text-zinc-400">The poll you're looking for doesn't exist or has been removed.</p>
            </div>
        );
    }

    return (
        <div className="bg-zinc-800 rounded-lg shadow-lg">
            <div className="p-6 border-b border-zinc-700">
                <h1 className="text-2xl font-bold text-white">{poll.title}</h1>
                {poll.description && <p className="mt-2 text-zinc-300">{poll.description}</p>}
                <div className="mt-3">
                    <a
                        href={`https://open.spotify.com/playlist/${poll.spotifyPlaylistId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-green-400 hover:text-green-300 transition-colors font-medium"
                    >
                        <svg className="w-5 h-5 mr-1.5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19.098 10.638c-3.868-2.297-10.248-2.508-13.941-1.387-.593.18-1.22-.155-1.399-.748-.18-.593.154-1.22.748-1.4 4.239-1.287 11.285-1.038 15.738 1.605.533.317.708 1.005.392 1.538-.316.533-1.005.709-1.538.392zm-.126 3.403c-.272.44-.847.578-1.287.308-3.225-1.982-8.142-2.557-11.958-1.399-.494.15-1.017-.129-1.167-.623-.149-.495.13-1.016.624-1.167 4.358-1.322 9.776-.682 13.48 1.595.44.27.578.847.308 1.286zm-1.469 3.267c-.215.354-.676.465-1.028.249-2.818-1.722-6.365-2.111-10.542-1.157-.402.092-.803-.16-.895-.562-.092-.403.159-.804.562-.896 4.571-1.045 8.492-.595 11.655 1.338.353.215.464.676.248 1.028zm-5.503-17.308c-6.627 0-12 5.373-12 12 0 6.628 5.373 12 12 12 6.628 0 12-5.372 12-12 0-6.627-5.372-12-12-12z" />
                        </svg>
                        Listen on Spotify
                    </a>
                </div>
                <div className="mt-1 flex items-center text-sm text-zinc-400">
                    <span>by {user.displayName}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(poll.createdAt).toLocaleDateString()}</span>
                    {/* <span className="mx-2">•</span>
                    <span>{getTotalVotes()} votes</span> */}
                </div>
            </div>

            <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Select one or more songs:</h2>

                {error && <div className="mb-4 p-3 bg-red-900/50 text-red-200 rounded-md">{error}</div>}

                <div className={`space-y-3 ${isSubmitting ? "opacity-75 pointer-events-none" : ""}`}>
                    {poll.songs.map((song) => (
                        <div
                            key={song.id}
                            className={`flex items-center p-3 rounded-lg transition-all ${
                                selectedOptions.includes(song.id)
                                    ? "bg-green-800/30 border border-green-500"
                                    : "bg-zinc-700/50 hover:bg-zinc-700 border border-transparent"
                            } ${isSubmitting ? "cursor-not-allowed" : "cursor-pointer"}`}
                            onClick={() => {
                                handleOptionSelect(song.id);
                            }}
                        >
                            <div className="h-12 w-12 flex-shrink-0 rounded mr-4">
                                <img
                                    src={song.albumImg}
                                    alt={`${song.album} cover`}
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            <div className="flex-1">
                                <h3 className="font-medium text-white">{song.title}</h3>
                                <p className="text-sm text-zinc-400">
                                    {song.artist} • {song.album}
                                </p>
                            </div>

                            <div
                                className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors
                                            ${
                                                selectedOptions.includes(song.id)
                                                    ? "border-green-500 bg-green-500/50"
                                                    : "border-zinc-500"
                                            }`}
                            >
                                {selectedOptions.includes(song.id) && (
                                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <Link
                        to={`/poll/${id}/results`}
                        className="text-zinc-400 hover:text-zinc-200 flex items-center transition-colors text-sm"
                    >
                        <BarChart2 className="h-4 w-4 mr-1" />
                        See current results
                    </Link>

                    <button
                        type="button"
                        onClick={handleVote}
                        disabled={isSubmitting}
                        className={`flex items-center justify-center py-2 px-6 rounded-full text-white font-medium transition-all ${
                            isSubmitting
                                ? "bg-green-700 cursor-not-allowed"
                                : "bg-green-600 hover:bg-green-700 cursor-pointer"
                        } min-w-32`}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            <>
                                Vote
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
