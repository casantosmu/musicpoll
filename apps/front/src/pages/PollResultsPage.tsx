import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { ChevronLeft } from "lucide-react";
import PollAPI, { Poll, PollResult } from "@/api/PollAPI";
import UserAPI, { User } from "@/api/UserAPI";

export default function PollResultsPage() {
    const [poll, setPoll] = useState<Poll | null>();
    const [isGetPollLoading, setIsGetPollLoading] = useState(true);

    const [user, setUser] = useState<User | null>();
    const [isGetUserLoading, setIsGetUserLoading] = useState(false);

    const [voteResults, setVoteResults] = useState<PollResult | null>();
    const [isGetVotesLoading, setIsGetVotesLoading] = useState(false);

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

        setIsGetUserLoading(true);
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

    useEffect(() => {
        if (!id) {
            return;
        }

        setIsGetVotesLoading(true);
        PollAPI.getResultByPollId(id)
            .then((result) => {
                if (result.success) {
                    setVoteResults(result.data);
                }
            })
            .catch(console.error)
            .finally(() => {
                setIsGetVotesLoading(false);
            });
    }, [id]);

    const isLoading = isGetPollLoading || isGetUserLoading || isGetVotesLoading;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    if (!poll || !user || !voteResults) {
        return (
            <div className="text-center p-8">
                <h2 className="text-xl font-semibold">Poll not found</h2>
                <p className="mt-2 text-zinc-400">The poll you're looking for doesn't exist or has been removed.</p>
            </div>
        );
    }

    const getVotePercentage = (vote: (typeof voteResults)["votes"][0]) => {
        if (voteResults.totalVotes === 0) {
            return 0;
        }
        return Math.round((vote.count / voteResults.totalVotes) * 100);
    };

    return (
        <div className="bg-zinc-800 rounded-lg shadow-lg">
            <div className="p-6 border-b border-zinc-700">
                <h1 className="text-2xl font-bold text-white">{poll.title} - Results</h1>
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
                    <span className="mx-2">•</span>
                    <span>
                        {voteResults.totalVotes} {voteResults.totalVotes === 1 ? "vote" : "votes"}
                    </span>
                </div>
            </div>

            <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Voting Results:</h2>

                <div className="space-y-4">
                    {voteResults.votes.map((song) => {
                        const percentage = getVotePercentage(song);

                        return (
                            <div key={song.id} className="p-3 bg-zinc-700/50 rounded-lg">
                                <div className="flex items-center mb-2">
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

                                    <div className="text-right pl-2">
                                        <span className="font-bold text-white">{percentage}%</span>
                                        <p className="text-sm text-zinc-400">
                                            {song.count} {song.count === 1 ? "vote" : "votes"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <span></span>
                    <Link
                        to={`/poll/${id}`}
                        className="flex items-center justify-center py-2 px-6 rounded-full text-white font-medium transition-all bg-zinc-600 hover:bg-zinc-700 min-w-32"
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Back to Poll
                    </Link>
                </div>
            </div>
        </div>
    );
}
