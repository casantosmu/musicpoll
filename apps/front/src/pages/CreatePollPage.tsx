import { ChangeEvent, FormEvent, useState } from "react";
import { Loader, Music } from "lucide-react";

export default function CreatePollPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        multipleOptions: false,
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

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            console.log(formData);
            setIsSubmitting(false);
        }, 1500);
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
                        id="multipleOptions"
                        name="multipleOptions"
                        checked={formData.multipleOptions}
                        onChange={handleOnChange}
                        className="h-5 w-5 accent-green-500"
                    />
                    <label htmlFor="multipleOptions" className="ml-3 block text-zinc-300">
                        Allow selection of multiple options
                    </label>
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
        </div>
    );
}
